const ACA = require('adsum-client-api');
const co = require('co');
const fs = require("fs");
const nodemailer = require('nodemailer');
const process = require("process");

const AbstractClientImporter = require("./AbstractClientImporter");
const AbstractPattern = require('./pattern/AbstractPattern');
const List = require('./pattern/structure/List');
const File = require('./pattern/structure/File');
const OrderedList = require('./pattern/structure/OrderedList');
const OrderedFileList = require('./pattern/structure/OrderedFileList');

/**
 * @readonly
 * @enum {string}
 */
const STATUS = {
    /** An entity is marked as ignored if it's not involved in import process (the entity has a null signature) */
    IGNORED: 'IGNORED',
    /** An entity is marked as kept if it's remain untouched */
    KEPT: 'KEPT',
    /** An entity is marked as created if it's a new entity */
    CREATED: 'CREATED',
    /** An entity is marked as kept if it's has been updated */
    UPDATED: 'UPDATED',
    /** An entity is marked as kept if it's has been removed */
    REMOVED: 'REMOVED',
};

/**
 *
 */
class GenericImporter {
    /**
     *
     * @param {ACA.EntityManager} em
     * @param {AbstractClientImporter} clientImporter
     */
    constructor(em, clientImporter) {
        if (!(em instanceof ACA.EntityManager)) {
            throw new Error("Generic importer require ACA.EntityManager instance");
        }
        if (!(clientImporter instanceof AbstractClientImporter)) {
            throw new Error("Client importer must implements AbstractClientImporter");
        }

        /**
         * The EntityManager instance
         *
         * @param ACA.EntityManager
         * @private
         */
        this._em = em;

        /**
         * The client importer instance
         *
         * @param AbstractClientImporter
         * @private
         */
        this._clientImporter = clientImporter;

        /**
         * An internal Map by ACA repository name containing a Map used to store already processed ACA.AbstractEntity
         * by signature to prevent infinite loop.
         *
         * @type {Map<string,Map<string,ACA.AbstractEntity>>}
         * @private
         */
        this._visitedMap = new Map();

        /**
         * An internal Map by ACA repository name containing list of used signatures retrieved from original data
         * (before the import has been run)
         *
         * @type {Map<string,string[]>}
         * @private
         */
        this._originalSignatures = new Map();

        /**
         * An internal Map by ACA repository name containing a Map used to store original signature to entity id
         *
         * @type {Map<string,Map<string,number>>}
         * @private
         */
        this._originalSignatureIdMap = new Map();

        /**
         * An internal Map by ACA repository name containing a Map used to store STATUS by id number
         *
         * @type {Map<string,Map<number,STATUS>>}
         * @private
         */
        this._changes = new Map();

        /**
         * An internal Map by ACA repository name containing a Map used to store orginal entity value by id
         *
         * @type {Map<string,Map<number,ACA.AbstractEntity>>}
         * @private
         */
        this._initialEntities = new Map();

        /**
         * An internal Map of content hashes by url used to improve performance to prevent computing already known
         * content hashes.
         *
         * @type {Map<string,string>}
         * @private
         */
        this._uriToContentHash = new Map();
    }

    /**
     * The import entry point
     *
     * @return {Promise}
     */
    run() {
        const self = this;
        return co(function *() {
            // Prepare
            yield self._prepare();

            // Fetch uri content hashes in batch process to improve update performances
            yield self._fetchUriContentHashes();

            // Run the update (all patterns saved by Client importer)
            self._update();

            // Run executions on all entities not saved by Client importer, this means they have been removed from client data
            self._executeRemove();

            // Finalise
            yield self._finish();
        }).catch(function (e) {
            console.error(e);
        });
    }

    /**
     * Prepare stuff
     *    - load client importer data
     *    - load ACA.EntityManager
     *    - Initialize internal Maps
     *    - Register to ACA event system to track CREATE, UPDATE, DELETE events
     *
     * @return {Promise}
     * @private
     */
    _prepare() {
        const self = this;
        return co(function *() {
            try {
                // Load the client importer data
                yield self._clientImporter.load();
            } catch (err) {
                console.error(err.message);
                console.log(err);

                throw new Error("Load client importer data failed");
            }

            try {
                yield self._em.load();
            } catch (err) {
                console.error(err.message);
                console.log(err);

                throw new Error("Load ACA.EntityManager failed");
            }

            // Initialize Site related Maps
            const site = self._em.getRepository("Site").getCurrent();
            self._initialEntities.set("Site", new Map());
            self._initialEntities.get("Site").set(site.id, site);

            // Initialize File related Maps
            const files = self._em.getRepository("File").getAll();
            self._initialEntities.set("File", new Map());
            for (const file of files) {
                self._initialEntities.get("File").set(file.id, file);
            }

            // Initialize Used repositories related Maps
            for (const repositoryName of self._clientImporter._getUsedRepositoryNames()) {
                const repository = self._em.getRepository(repositoryName);

                self._changes.set(repositoryName, new Map());
                self._initialEntities.set(repositoryName, new Map());
                self._originalSignatures.set(repositoryName, []);
                self._originalSignatureIdMap.set(repositoryName, new Map());
                self._visitedMap.set(repositoryName, new Map());

                const entities = repository.getAll();
                for (const entity of entities) {
                    if (entity.signature) {
                        self._originalSignatures.get(repositoryName).push(entity.signature);
                        self._originalSignatureIdMap.get(repositoryName).set(entity.signature, entity.id);

                        // Assume Kept status as there is a signature
                        self._changes.get(repositoryName).set(entity.id, STATUS.KEPT);
                    } else {
                        // Assume Kept status as there isn't a signature
                        self._changes.get(repositoryName).set(entity.id, STATUS.IGNORED);
                    }
                    self._initialEntities.get(repositoryName).set(entity.id, entity);
                }

                // Register to ACA events
                ACA.EventDispatcher.subscribe(repository, ACA.REPOSITORY_EVENTS.CREATE, (entity) => {
                    self._onCreate(repositoryName, entity);
                });
                ACA.EventDispatcher.subscribe(repository, ACA.REPOSITORY_EVENTS.UPDATE, ({current}) => {
                    self._onUpdate(repositoryName, current);
                });
                ACA.EventDispatcher.subscribe(repository, ACA.REPOSITORY_EVENTS.REMOVE, (entity) => {
                    self._onRemove(repositoryName, entity);
                });
                ACA.EventDispatcher.subscribe(repository, ACA.REPOSITORY_EVENTS.IDENTIFIER_WILL_CHANGE, ([oldId, newId]) => {
                    self._onIdentifierChange(repositoryName, oldId, newId);
                });
            }

        });
    }

    /**
     * Callback on ACA.REPOSITORY_EVENTS.CREATE that update changed status
     *
     * @param {string} repositoryName
     * @param {ACA.AbstractEntity} entity
     * @private
     */
    _onCreate(repositoryName, entity) {
        this._changes.get(repositoryName).set(entity.id, STATUS.CREATED);
    }

    /**
     * Callback on ACA.REPOSITORY_EVENTS.UPDATE that update changed status
     *
     * @param {string} repositoryName
     * @param {ACA.AbstractEntity} current The new ACA entity value
     * @private
     */
    _onUpdate(repositoryName, current) {
        const currentStatus = this._changes.get(repositoryName).get(current.id);

        // If status is already CREATED, just ignore UPDATE
        if (currentStatus !== STATUS.CREATED) {
            this._changes.get(repositoryName).set(current.id, STATUS.UPDATED);
        }
    }

    /**
     * Callback on ACA.REPOSITORY_EVENTS.REMOVE that update changed status
     *
     * @param {string} repositoryName
     * @param {ACA.AbstractEntity} entity The removed ACA Entity
     * @private
     */
    _onRemove(repositoryName, entity) {
        this._changes.get(repositoryName).set(entity.id, STATUS.REMOVED);
    }

    /**
     * Callback on ACA.REPOSITORY_EVENTS.IDENTIFIER_WILL_CHANGE that update changed status
     *
     * @param {string} repositoryName
     * @param {number} oldId
     * @param {number} newId
     * @private
     */
    _onIdentifierChange(repositoryName, oldId, newId) {
        const repositoryChanges = this._changes.get(repositoryName);

        if (repositoryChanges.has(oldId)) {
            const status = repositoryChanges.get(oldId);
            repositoryChanges.delete(oldId);
            repositoryChanges.set(newId, status);
        }
    }

    /**
     * Fetch all used uri from File structure to improve performances
     *
     * @return {Promise}
     * @private
     */
    _fetchUriContentHashes() {
        let promise = null;
        const files = Array.from(File.getAll());

        if(files.length === 0){
            return Promise.resolve();
        }

        let count = 0;
        const total = files.length;

        console.log(`Fetching content hashes of ${total} files`);

        const chunks = [], size = 10;

        while (files.length > 0)
            chunks.push(files.splice(0, size));

        for (const chunk of chunks) {
            if(promise === null){
                promise = this._fetchUriContentHashesBunch(chunk);
            }else{
                promise = promise.then(() => {
                    return this._fetchUriContentHashesBunch(chunk);
                });
            }

            promise = promise.then(() => {
                count += chunk.length;
                console.log(`Fetching content hashes: ${count}/${total}`);
            });
        }

        return promise.then(() => {
            console.log("All content hashes fetched");
        });
    }

    _fetchUriContentHashesBunch(files){
        const promises = [];

        for (const file of files) {
            let promise = ACA.Request.getUriContentHash(file.uri).then((contentHash) => {
                this._uriToContentHash.set(file.uri, contentHash);
            }).catch(e => {

                // console.error(`Unable to fetch file ${file.uri}`);
                promise = ACA.Request.getUriContentHash(file.uri).then((contentHash) => {
                    this._uriToContentHash.set(file.uri, contentHash);
                }).catch(e => {
                    // console.error(`Unable to fetch file ${file.uri}`);
                    promise = ACA.Request.getUriContentHash(file.uri).then((contentHash) => {
                        this._uriToContentHash.set(file.uri, contentHash);
                    }).catch(e => {
                        promise = ACA.Request.getUriContentHash(file.uri).then((contentHash) => {
                            this._uriToContentHash.set(file.uri, contentHash);
                        }).catch(e => {
                            promise = ACA.Request.getUriContentHash(file.uri).then((contentHash) => {
                                this._uriToContentHash.set(file.uri, contentHash);
                            }).catch(e => {
                            console.error(`Unable to fetch file ${file.uri}`);
                            this._uriToContentHash.set(file.uri, null);
                            })
                        })
                    })
                });
               
            });

            promises.push(promise);
        }

        return Promise.all(promises);
    }

    /**
     * Execute update from saved pattern by Client importer
     *
     * @return {void}
     * @private
     */
    _update() {
        for (const repositoryName of this._clientImporter._getUsedRepositoryNames()) {
            this._updateRepository(repositoryName);
        }
    }

    /**
     * Execute update from saved pattern by Client importer for a specific repository
     *
     * @param {string} repositoryName
     * @return {void}
     * @private
     */
    _updateRepository(repositoryName) {
        const patterns = this._clientImporter._getSavedPatternForRepository(repositoryName);

        for (const pattern of patterns) {
            this._updatePattern(pattern);
        }
    }

    /**
     * Update a pattern recursively (run down all linked patterns)
     *
     * @param {AbstractPattern} pattern
     * @return {ACA.AbstractEntity}
     * @private
     */
    _updatePattern(pattern) {
        const repositoryName = pattern.constructor._getRepositoryName();

        // Prevent looping
        if (this._isVisited(pattern)) {
            return this._visitedMap.get(repositoryName).get(pattern.signature);
        }

        let entity = this._em.getRepository(repositoryName).findOneBy({signature: pattern.signature});

        if (entity === null) {
            // Not found: Create a new one
            entity = new (pattern.constructor._getEntityConstructor())();
        } else if (entity.constructor !== pattern.constructor._getEntityConstructor()) {
            // Type changed
            const data = entity.toJSON();
            delete data.type;

            // Force reset signature to prevent unique entity error
            const previous = entity.clone();
            if(previous.constructor.keys.includes("signature")){
                previous.signature = null;
                this._em.getRepository(repositoryName).persist(previous);
            }

            entity = new (pattern.constructor._getEntityConstructor())(data);
        } else {
            // Found: used to update
            entity = entity.clone();
        }

        // Mark as visited before from here to prevent loop while recurse on properties
        this._markVisited(pattern, entity);

        // Update simple properties (the one that are not relations)
        for (const key of pattern.constructor._getKeys()) {
            const value = pattern[key];
            if (value instanceof AbstractPattern || value instanceof List || value instanceof OrderedList) {
                continue;
            }

            this._updateKeyPattern(entity, pattern, key);
        }

        // Save the entity, to make sure the entity has an id before process relations
        this._em.getRepository(repositoryName).persist(entity);

        // Process recursively relations properties
        for (const key of pattern.constructor._getKeys()) {
            const value = pattern[key];
            if (value instanceof AbstractPattern || value instanceof List || value instanceof OrderedList) {
                this._updateKeyPattern(entity, pattern, key);
            }
        }

        this._em.getRepository(repositoryName).persist(entity);

        return entity;
    }

    /**
     * Does an AbstractPattern has been visited
     *
     * @param {AbstractPattern} pattern
     * @return {boolean}
     * @private
     */
    _isVisited(pattern) {
        const repositoryName = pattern.constructor._getRepositoryName();
        if (!this._visitedMap.has(repositoryName)) {
            return false;
        }

        return this._visitedMap.get(repositoryName).has(pattern.signature);
    }

    /**
     * Save an AbstractPattern result
     *
     * @param {AbstractPattern} pattern
     * @param {ACA.AbstractEntity} entity
     *
     * @private
     */
    _markVisited(pattern, entity) {
        const repositoryName = pattern.constructor._getRepositoryName();

        this._visitedMap.get(repositoryName).set(`${pattern.signature}`, entity);
    }

    /**
     * Update a field pattern into the entity
     *
     * @param {ACA.AbstractEntity} entity
     * @param {AbstractPattern} pattern
     * @param {string} key
     * @return {void}
     * @private
     */
    _updateKeyPattern(entity, pattern, key) {
        const value = pattern[key];

        // If value is undefined, this means that property has not been processed by the Client importer
        if (value === undefined) {
            return;
        }

        // If value is undefined, this means that property has not been processed by the Client importer
        if (
            (value instanceof List || value instanceof OrderedFileList || value instanceof OrderedList)
            && value.list === undefined
        ) {
            return;
        }

        switch (true) {
            case (value instanceof AbstractPattern):
                this._updatePatternKey(entity, key, value);
                break;
            case (value instanceof List):
                this._updateListKey(entity, key, value);
                break;
            case (value instanceof OrderedList):
                this._updateOrderedListKey(entity, key, value);
                break;
            case (value instanceof OrderedFileList):
                this._updateOrderedFileListKey(entity, key, value);
                break;
            case (value instanceof File):
                this._updateFileKey(entity, key, value);
                break;
            default:
                this._updateSimpleKey(entity, key, value);
        }
    }

    /**
     * Update an entity toOne relation property
     *
     * @param {ACA.AbstractEntity} entity
     * @param {string} key
     * @param {AbstractPattern} value
     * @return {void}
     * @private
     */
    _updatePatternKey(entity, key, value) {
        entity[key] = this._updatePattern(value);
    }

    /**
     * Update an entity basic property
     *
     * @param {ACA.AbstractEntity} entity
     * @param {string} key
     * @param {*} value
     * @return {void}
     * @private
     */
    _updateSimpleKey(entity, key, value) {
        entity[key] = value;
    }

    /**
     * Update an entity List property
     *
     * @param {ACA.AbstractEntity} entity
     * @param {string} key
     * @param {List} value
     * @return {void}
     * @private
     */
    _updateListKey(entity, key, value) {

        if (!(entity[key] instanceof ACA.Collection)) {
            throw new Error(`Invalid pattern key ${key} of ${entity.constructor.name} expected a Collection`);
        }

        const references = [];
        for (const v of value.list) {
            references.push(this._updatePattern(v));
        }

        entity[key] = references;
    }

    /**
     * Update an entity List property
     *
     * @param {ACA.AbstractEntity} entity
     * @param {string} key
     * @param {OrderedList} value
     * @return {void}
     * @private
     */
    _updateOrderedListKey(entity, key, value) {
        if (!(entity[key] instanceof ACA.OrderedCollection)) {
            throw new Error(`Invalid pattern key ${key} of ${entity.constructor.name} expected a OrderedCollection`);
        }

        const items = [];
        for (const {pattern: v, position} of value.list) {
            items.push({id: this._updatePattern(v), position});
        }

        entity[key] = items;
    }

    /**
     * Update an entity OrderedFileList property
     *
     * @param {ACA.AbstractEntity} entity
     * @param {string} key
     * @param {OrderedFileList} value
     * @return {void}
     * @private
     */
    _updateOrderedFileListKey(entity, key, value) {
        const contentHashes = [];

        if (!(entity[key] instanceof ACA.OrderedCollection && entity[key].classOf === "File")) {
            throw new Error(`Invalid pattern key ${key} of ${entity.constructor.name} expected a OrderedCollection<File>`);
        }

        for (const {pattern: p, position} of value.list) {
            contentHashes.push(this._uriToContentHash.get(p.uri));
        }

        // Get originals content hashes
        const initialContentHashes = new Map();
        for (const {id, position} of entity[key]) {
            const initialFile = this._em.getRepository("File").get(id);
            initialContentHashes.set(initialFile.content_hash, initialFile.clone());
        }

        const references = [];
        for (let i = 0; i < contentHashes.length; i++) {
            const contentHash = contentHashes[i];

            if (contentHash === null) {
                continue;
            }

            const {pattern: p, position} = value.list[i];

            let file = null;
            if (initialContentHashes.has(contentHash)) {
                // If the imported content hash from Client importer is in original, skip uri update
                file = initialContentHashes.get(contentHash);
            } else {
                // Else create a new file
                file = new ACA.File();
                file.uri = p.uri;
            }

            file.name = p.name;

            // Save the file
            this._em.getRepository("File").persist(file);

            references.push({id: file, position});
        }

        // Update the relation
        entity[key] = references;
    }

    /**
     * Update an entity File property
     *
     * @param {ACA.AbstractEntity} entity
     * @param {string} key
     * @param {File} value
     * @return {void}
     * @private
     */
    _updateFileKey(entity, key, value) {
        const contentHash = this._uriToContentHash.get(value.uri);

        if (contentHash === null) {
            entity[key] = null;
            return;
        }

        let file = null;
        if (entity[key].is(null)) {
            // If the original entity wasn't linked to a file, create a new one
            file = new ACA.File();
        } else {
            // Else use the already saved entity
            const reference = entity[key];
            file = this._em.getRepository(reference.classOf).get(reference).clone();
        }

        file.name = value.name;
        if (file.content_hash !== contentHash) {
            // If content hash miss-matched, updated the uri
            file.uri = value.uri;
        }

        // Save the file
        this._em.getRepository("File").persist(file);

        // Update the property relation
        entity[key] = file;
    }

    /**
     * Execute remove
     *
     * @private
     */
    _executeRemove() {
        for (const repositoryName of this._clientImporter._getUsedRepositoryNames()) {
            this._executeRemoveForRepository(repositoryName);
        }
    }

    /**
     * Excute remove for a specific repository
     * @param {string} repositoryName
     * @private
     */
    _executeRemoveForRepository(repositoryName) {
        const visitedSignatures = Array.from(this._visitedMap.get(repositoryName).keys());
        const originalSignatures = this._originalSignatures.get(repositoryName);

        for (const originalSignature of originalSignatures) {
            if (!visitedSignatures.includes(originalSignature)) {
                // If it's not visited, then remove the entity
                const id = this._originalSignatureIdMap.get(repositoryName).get(originalSignature);
                this._em.getRepository(repositoryName).remove(id);
            }
        }
    }

    /**
     * Finish import:
     *     - Flush the ACA
     *     - Process and send the report
     *
     * @return {Promise}
     * @private
     */
    _finish() {
        const self = this;
        return co(function *() {
            console.log("Flushing");
            yield self._em.flush();

            // Process and send report after flush as the flush as ACA must return false positive
            yield self._sendReport();

            console.log("Done");
        });
    }

    /**
     * Process and send the report based on data fetched by ACA.EntityManager after flush to detect all real changes
     *
     * @return {Promise}
     * @private
     */
    _sendReport() {
        console.log("Generate report");
        const report = this._generateReport();

        // Format the report into HTML format
        const now = new Date();
        const historyDirectory = './history';
        const filename = `${historyDirectory}/${now.toISOString()}.html`;

        if (!fs.existsSync(historyDirectory)) {
            fs.mkdirSync(historyDirectory);
        }

        console.log("Format report");
        const site = this._em.getRepository("Site").getCurrent();
        const name = typeof this._clientImporter.getName === "function" ? this._clientImporter.getName() : this._clientImporter.constructor.getName();
        const title = `${name} on ${site.name} (${site.id}): ${now.toUTCString()}`;
        const html = this.formatReportToHtml(title, report);

        // Save report locally
        fs.writeFileSync(filename, html);
        console.log(`Report written into ${filename}`);

        console.log("Sending report via mail");
        let transporter = nodemailer.createTransport(this._clientImporter.getEmailsTransportOptions());

        // setup email data with unicode symbols
        let mailOptions = this._clientImporter.getEmailsOptions(title, html);

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error.message);
                    console.log(error);

                    reject(new Error("Unable to send report"));
                    return;
                }

                console.log('Report %s sent: %s', info.messageId, info.response);
                resolve();
            });
        });
    }

    /**
     * @typedef {Object} Report
     * @property {ReportSummary} summary
     * @property {ReportDetails} summary
     */

    /**
     * @typedef {Object} ReportSummary
     * @property {ReportSummaryItem[]} UPDATED
     * @property {ReportSummaryItem[]} CREATED
     * @property {ReportSummaryItem[]} REMOVED
     * @property {ReportSummaryItem[]} KEPT
     * @property {ReportSummaryItem[]} IGNORED
     */

    /**
     * @typedef {Object} ReportSummaryItem
     * @property {string} name
     * @property {number} id
     * @property {string} signature
     */

    /**
     * @typedef {Object} ReportDetails
     * @property {DiffResult} UPDATED
     */

    /**
     * @typedef {Object<number,DiffResultItem[]>} DiffResult
     */

    /**
     * @typedef {Object} DiffResultItem
     * @property {string} property
     * @property {string} from
     * @property {string} to
     */

    /**
     *
     * @return {Report} report
     * @private
     */
    _generateReport() {
        const report = {};
        const repositoryNames = this._changes.keys();
        for (const repositoryName of repositoryNames) {
            const summary = {
                [STATUS.UPDATED]: [],
                [STATUS.CREATED]: [],
                [STATUS.REMOVED]: [],
                [STATUS.KEPT]: [],
                [STATUS.IGNORED]: [],
            };

            const details = {
                [STATUS.UPDATED]: {},
            };

            const ids = this._changes.get(repositoryName).keys();
            for (const id of ids) {
                const status = this._changes.get(repositoryName).get(id);
                switch (status) {
                    case STATUS.REMOVED:
                        const removedEntity = this._initialEntities.get(repositoryName).get(id);

                        if (removedEntity) {
                            // Sometimes, it's happen that a CREATED entity is then REMOVED (due to internal listeners)
                            // So only treat removed entities that was in original data

                            summary[status].push(
                                {
                                    name: removedEntity.name,
                                    id: removedEntity.id,
                                    signature: removedEntity.signature
                                }
                            );
                        }

                        break;
                    case STATUS.IGNORED:
                    case STATUS.KEPT:
                        const entity = this._em.getRepository(repositoryName).get(id);

                        summary[status].push(
                            {
                                name: entity.name,
                                id: entity.id,
                                signature: entity.signature
                            }
                        );
                        break;
                    case STATUS.CREATED:
                        const createdEntity = this._em.getRepository(repositoryName).get(id);

                        if (createdEntity) {
                            // Sometimes, it's happen that a CREATED entity is then REMOVED (due to internal listeners)
                            // So only treat created entities that are in final data

                            summary[status].push(
                                {
                                    name: createdEntity.name,
                                    id: createdEntity.id,
                                    signature: createdEntity.signature
                                }
                            );
                        }
                        break;
                    case STATUS.UPDATED:
                        const initialEntity = this._initialEntities.get(repositoryName).get(id);
                        const currentEntity = this._em.getRepository(repositoryName).get(id);

                        const diffs = this._getDiff(initialEntity, currentEntity);

                        if (diffs.length > 0) {
                            summary[status].push(
                                {
                                    name: currentEntity.name,
                                    id: currentEntity.id,
                                    signature: currentEntity.signature
                                }
                            );

                            details[status][currentEntity.id] = diffs;
                        } else {
                            // if no diff detected, mark the entity as kept
                            summary[STATUS.KEPT].push(
                                {
                                    name: currentEntity.name,
                                    id: currentEntity.id,
                                    signature: currentEntity.signature
                                }
                            );
                        }
                        break;
                }
            }

            report[repositoryName] = {
                summary,
                details
            };
        }

        return report;
    }

    /**
     *
     * @param {ACA.AbstractEntity} fromEntity
     * @param {ACA.AbstractEntity} toEntity
     * @return {DiffResultItem[]}
     * @private
     */
    _getDiff(fromEntity, toEntity) {
        const skippedKeys = new Set(["version", "updated_at", "created_at", "metadata"]);
        const updateDiff = [];

        const fromData = fromEntity ? fromEntity.toJSON() : "null";
        const toData = toEntity ? toEntity.toJSON() : "null";

        for (const key of fromEntity.constructor.keys) {
            // Skip ignored keys
            if (skippedKeys.has(key)) {
                continue;
            }

            const fromValue = fromEntity[key];
            const toValue = toEntity[key];

            if (fromValue instanceof ACA.Reference && fromValue.classOf === "File") {
                // Special case of File Reference, use uri as comparison

                const fromUri = fromValue.is(null) ? "null" : this._initialEntities.get("File").get(fromValue.value).uri;
                const toUri = toValue.is(null) ? "null" : this._em.getRepository("File").get(toValue).uri;

                if (fromUri !== toUri) {
                    updateDiff.push(
                        {
                            property: key,
                            from: fromUri,
                            to: toUri
                        }
                    )
                }
            } else if (fromValue instanceof ACA.OrderedCollection && fromValue.classOf === "File") {
                // Special case of File OrderedCollection, use uri as comparison

                const fromUris = [];
                for (const {id} of fromValue) {
                    fromUris.push(this._initialEntities.get("File").get(id).uri);
                }

                const toUris = this._em.getRepository("File").getList(toValue).map((file) => {
                    return file.uri;
                });

                // Sort to prevent order change making false positive
                fromUris.sort();
                toUris.sort();

                if (JSON.stringify(fromUris) !== JSON.stringify(toUris)) {
                    updateDiff.push(
                        {
                            property: key,
                            from: JSON.stringify(fromUris),
                            to: JSON.stringify(toUris)
                        }
                    )
                }
            } else if (fromValue instanceof ACA.Reference && this._initialEntities.has(fromValue.classOf)) {
                // Special case of Reference

                const fromRef = fromValue.is(null) ? null : this._initialEntities.get(fromValue.classOf).get(fromValue.value);
                const toRef = this._em.getRepository(toValue.classOf).get(toValue);

                if (
                    (fromRef === null && toRef !== null)
                    || (fromRef !== null && toRef === null)
                    || fromRef.name !== toRef.name
                ) {
                    updateDiff.push(
                        {
                            property: key,
                            from: `${fromRef.name} (${fromRef.id})`,
                            to: `${toRef.name} (${toRef.id})`
                        }
                    );
                }
            } else if (fromValue instanceof ACA.OrderedCollection && this._initialEntities.has(fromValue.classOf)) {
                // Special case of OrderedCollection

                const fromNames = [];
                for (const {id} of fromValue) {
                    const entity = this._initialEntities.get(fromValue.classOf).get(id);

                    fromNames.push(`${entity.name} (${entity.id})`);
                }

                const toNames = this._em.getRepository(toValue.classOf).getList(toValue).map((entity) => {
                    return `${entity.name} (${entity.id})`;
                });

                // Sort to prevent order change making false positive
                fromNames.sort();
                toNames.sort();

                if (JSON.stringify(fromNames) !== JSON.stringify(toNames)) {
                    updateDiff.push(
                        {
                            property: key,
                            from: JSON.stringify(fromNames),
                            to: JSON.stringify(toNames)
                        }
                    )
                }
            } else if (fromValue instanceof ACA.Collection && this._initialEntities.has(fromValue.classOf)) {
                // Special case of Collection

                const fromNames = [];
                for (const id of fromValue) {
                    const entity = this._initialEntities.get(fromValue.classOf).get(id);

                    fromNames.push(`${entity.name} (${entity.id})`);
                }

                const toNames = this._em.getRepository(toValue.classOf).getList(toValue).map((entity) => {
                    return `${entity.name} (${entity.id})`;
                });

                // Sort to prevent order change making false positive
                fromNames.sort();
                toNames.sort();

                if (JSON.stringify(fromNames) !== JSON.stringify(toNames)) {
                    updateDiff.push(
                        {
                            property: key,
                            from: JSON.stringify(fromNames),
                            to: JSON.stringify(toNames)
                        }
                    )
                }
            } else {
                // Default case

                if (JSON.stringify(fromData[key]) !== JSON.stringify(toData[key])) {
                    updateDiff.push(
                        {
                            property: key,
                            from: JSON.stringify(fromData[key]),
                            to: JSON.stringify(toData[key])
                        }
                    );
                }
            }
        }

        return updateDiff;
    }

    /**
     * Format HTML report
     *
     * @param title
     * @param report
     * @return {string}
     */
    formatReportToHtml(title, report) {
        const htmlParts = [];

        htmlParts.push('<html>');
        htmlParts.push(`<head></head>`);
        htmlParts.push('<body><div>');
        htmlParts.push(`<h1>${title} <legend>${this._em.options.endpoint}</legend></h1>`);

        htmlParts.push(this._formatSummaryHtml(report));
        htmlParts.push(this._formatDetailsHtml(report));

        htmlParts.push('</div></body></html>');

        return htmlParts.join('');
    }

    /**
     * Format HTML report summary
     *
     * @param report
     * @return {string}
     * @private
     */
    _formatSummaryHtml(report) {
        const htmlParts = [];

        htmlParts.push('<h2>SUMMARY</h2>');

        const repositoryNames = Object.keys(report);
        const rows = [];

        for (const repositoryName of repositoryNames) {
            rows.push(
                {
                    repositoryName,
                    [STATUS.UPDATED]: report[repositoryName].summary[STATUS.UPDATED].length,
                    [STATUS.CREATED]: report[repositoryName].summary[STATUS.CREATED].length,
                    [STATUS.REMOVED]: report[repositoryName].summary[STATUS.REMOVED].length,
                    [STATUS.KEPT]: report[repositoryName].summary[STATUS.KEPT].length,
                    [STATUS.IGNORED]: report[repositoryName].summary[STATUS.IGNORED].length,
                }
            );
        }

        htmlParts.push(
            this._createHtmlTable(
                "",
                [
                    {name: "Type", key: "repositoryName"},
                    {name: STATUS.UPDATED, key: STATUS.UPDATED},
                    {name: STATUS.CREATED, key: STATUS.CREATED},
                    {name: STATUS.REMOVED, key: STATUS.REMOVED},
                    {name: STATUS.KEPT, key: STATUS.KEPT},
                    {name: STATUS.IGNORED, key: STATUS.IGNORED},
                ],
                rows
            )
        );

        return htmlParts.join('');
    }

    /**
     * Format HTML report details
     *
     * @param report
     * @return {string}
     * @private
     */
    _formatDetailsHtml(report) {
        const htmlParts = [];

        let changesCount = 0;
        const changesCountByRepository = new Map();
        const repositoryNames = Object.keys(report);

        for (const repositoryName of repositoryNames) {
            let repositoryChangeCount = report[repositoryName].summary[STATUS.UPDATED].length;
            repositoryChangeCount += report[repositoryName].summary[STATUS.CREATED].length;
            repositoryChangeCount += report[repositoryName].summary[STATUS.REMOVED].length;

            changesCount += repositoryChangeCount;
            changesCountByRepository.set(repositoryName, repositoryChangeCount);
        }

        if (changesCount === 0) {
            // Skip if no changes

            return '';
        }

        htmlParts.push('<h2>DETAILS</h2>');

        for (const repositoryName of repositoryNames) {
            if (changesCountByRepository.get(repositoryName) === 0) {
                continue;
            }

            htmlParts.push(`<h3>${repositoryName}</h3>`);
            const statuses = Object.keys(report[repositoryName].summary);
            for (const status of statuses) {
                if (status === STATUS.UPDATED && report[repositoryName].summary[status].length > 0) {
                    htmlParts.push(
                        this._formatRepositoryDetailsHtml(
                            repositoryName,
                            status,
                            report[repositoryName].details[status]
                        )
                    );
                } else if ([STATUS.CREATED, STATUS.REMOVED].includes(status) && report[repositoryName].summary[status].length > 0) {
                    htmlParts.push(
                        this._createHtmlTable(
                            status,
                            [
                                {name: "Name", key: "name"},
                                {name: "Client ID", key: "signature"},
                                {name: "Adsum ID", key: "id"},
                            ],
                            report[repositoryName].summary[status]
                        )
                    );
                }
            }
        }

        return htmlParts.join('');
    }

    /**
     * Format HTML report details for a repository
     *
     * @param {string} repositoryName
     * @param {string} status
     * @param {DiffResult} updateDetails
     * @return {string}
     * @private
     */
    _formatRepositoryDetailsHtml(repositoryName, status, updateDetails) {

        const htmlParts = [];

        htmlParts.push(`<h4>${status}</h4>`);

        const ids = Object.keys(updateDetails);

        if (ids.length === 0) {
            htmlParts.push('<p>None</p>');
        }

        for (const id of ids) {
            htmlParts.push(
                this._createHtmlTable(
                    `${repositoryName} of Adsum id ${id}`,
                    [
                        {name: "Property", key: "property"},
                        {name: "From", key: "from"},
                        {name: "To", key: "to"},
                    ],
                    updateDetails[id]
                )
            );
        }

        return htmlParts.join('');
    }

    /**
     * Create a HTML table
     *
     * @param {string} title
     * @param {Array.<{name: {string}, key: {string}}>} columns
     * @param {Array.<Object<string,string>>} rows
     * @return {string}
     * @private
     */
    _createHtmlTable(title, columns, rows) {
        if (rows.length === 0) {
            return '';
        }

        const htmlParts = [];

        htmlParts.push('<table style="border: 1px solid #ddd;width: 100%;max-width: 100%;margin-bottom: 20px;background-color: transparent;border-spacing: 0;border-collapse: collapse;">');

        // Title
        htmlParts.push(`<caption style="padding-top: 8px;padding-bottom: 8px;color: #777;text-align: left;">${title}</caption>`);

        // Header
        htmlParts.push("<thead>");
        htmlParts.push('<tr>');
        for (const column of columns) {
            htmlParts.push(`<th style="border-top: 0;border: 1px solid #ddd;vertical-align: bottom;padding: 8px;line-height: 1.42857143;text-align: left;font-weight: bold;">`);
            htmlParts.push(`${column.name}`);
            htmlParts.push(`</th>`);
        }
        htmlParts.push('</tr>');
        htmlParts.push("</thead>");

        // Rows
        htmlParts.push("<tbody>");
        for (const row of rows) {
            htmlParts.push('<tr>');
            for (const column of columns) {
                htmlParts.push(`<td style="border: 1px solid #ddd;padding: 8px;line-height: 1.42857143;vertical-align: top;">`);
                htmlParts.push(`${row[column.key]}`);
                htmlParts.push(`</td>`);
            }
            htmlParts.push('</tr>');
        }
        htmlParts.push("</tbody>");

        htmlParts.push('</table>');

        return htmlParts.join('');
    }
}
module.exports = GenericImporter;

