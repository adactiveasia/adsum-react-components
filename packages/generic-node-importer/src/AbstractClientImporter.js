class AbstractClientImporter {
    /**
     * This is a basic constructor that expect an options argument which will be available under
     * the options property. You can put everything you wanted in order to be used in your specific implementation.
     *
     * @param {Object} options
     */
    constructor(options) {
        /**
         * @property {Object}
         */
        this.options = options;

        /**
         *
         * @type {Object<string,Object<string,AbstractPattern>>}
         * @private
         */
        this._objectsBySignatureByRepositoryName = {};
    }

    /**
     * @return {string}
     */
    getName() {
        return this.constructor.name;
    }

    /**
     * @abstract
     * @return {string[]}
     */
    getReportEmails() {
        throw new Error("Client importer must implements getReportEmails method");
    }

    /**
     *
     * @param title
     * @param html
     * @returns {{from: string, to: string, subject: *, html: *}}
     */
    getEmailsOptions(title, html) {
        const reportEmails = typeof this.getReportEmails === "function" ? this.getReportEmails() : this.constructor.getReportEmails();

        return {
            from: "\"Importer \" <support@adactive.com>", // sender address
            to: reportEmails.join(", "), // list of receivers
            subject: title, // Subject line
            html: html // html body
        };
    }

    /**
     *
     * @returns {{service: string, auth: {user: string, pass: string}}}
     */
    getEmailsTransportOptions() {
        return {
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "support@adactive.com",
                pass: "showroom75"
            }

        };
    }

    /**
     * This abstract method is dedicated to be used in GenericImporter in order to load all client data.
     * There is only one requirement: It must return a Promise that will be resolved when client data is fully loaded
     *
     * @abstract
     * @return {Promise}
     */
    load() {
        throw new Error("Client importer must implements load method");
    }

    /**
     * Methods is dedicated to be used into load() implementation to save a client data formatted
     * into our pattern schema.
     *
     * @param {AbstractPattern} pattern
     */
    save(pattern) {
        const signature = pattern.signature;

        if (!signature) {
            throw new Error("Cannot save an object without signature");
        }

        const existingSavedObject = this.getSavedPatternBySignature(pattern.constructor, signature);

        if (existingSavedObject !== null && existingSavedObject !== pattern) {
            // Ensure pattern instance is unique by signature to prevent conflict

            throw new Error("Trying to save an already saved signature");
        }

        const repositoryName = pattern.constructor._getRepositoryName();

        if (!this._objectsBySignatureByRepositoryName.hasOwnProperty(repositoryName)) {
            this._objectsBySignatureByRepositoryName[repositoryName] = {};
        }

        this._objectsBySignatureByRepositoryName[repositoryName][signature] = pattern;
    }

    /**
     * Retrieve an already saved pattern
     *
     * @param {AbstractPattern.constructor} patternConstructor
     * @param {string} signature
     * @return {null|AbstractPattern}
     */
    getSavedPatternBySignature(patternConstructor, signature) {
        const repositoryName = patternConstructor._getRepositoryName();

        if (!this._objectsBySignatureByRepositoryName.hasOwnProperty(repositoryName)) {
            return null;
        }

        const objectsBySignature = this._objectsBySignatureByRepositoryName[repositoryName];

        return objectsBySignature.hasOwnProperty(signature) ? objectsBySignature[signature] : null;
    }

    /**
     * Retrieve an already saved pattern, if does not exists then it will create a new one
     *
     * @param {AbstractPattern.constructor} patternConstructor
     * @param {string} signature
     * @param {boolean} [autoSave=true]
     * @return {null|AbstractPattern}
     */
    getOrCreatePattern(patternConstructor, signature, autoSave = true) {
        let pattern = this.getSavedPatternBySignature(patternConstructor, signature);

        if (pattern === null) {
            pattern = new patternConstructor(true);
            pattern.signature = signature;

            if (autoSave) {
                this.save(pattern);
            }
        }

        return pattern;
    }

    /**
     * Retrieve all repositories impacted by the Client importer
     *
     * @return {string[]}
     * @private
     */
    _getUsedRepositoryNames() {
        return Object.keys(this._objectsBySignatureByRepositoryName);
    }

    /**
     * Retrieve all saved patterns of a repository
     *
     * @param {string} repositoryName
     * @return {AbstractPattern[]}
     * @private
     */
    _getSavedPatternForRepository(repositoryName) {
        const patterns = [];
        const signatures = Object.keys(this._objectsBySignatureByRepositoryName[repositoryName]);

        for (const signature of signatures) {
            patterns.push(this._objectsBySignatureByRepositoryName[repositoryName][signature]);
        }

        return patterns;
    }
}

module.exports = AbstractClientImporter;
