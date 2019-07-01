const ACA = require("adsum-client-api");
const AbstractPattern = require("./AbstractPattern");
const OrderedList = require('./structure/OrderedList');
const List = require('./structure/List');

/**
 *
 */
class MediaTextPattern extends AbstractPattern {

    /**
     * @inheritDoc
     */
    static _getRepositoryName() {
        return "Media";
    }

    /**
     * @inheritDoc
     */
    static _getEntityConstructor() {
        return ACA.MediaText;
    }

    /**
     * @inheritDoc
     */
    static _getKeys() {
        return [
            "client_id",
            "description",
            "end_at",
            "name",
            "signature",
            "start_at",
            "format",
            "identifier",
            "content",
            "preview",
            "playlists",
            "pois",
            "tags",
            "metadata"
        ];
    }

    constructor(safe = false) {
        super(safe);

        /**
         *
         * @type {undefined|null|string}
         */
        this.client_id = undefined;

        /**
         *
         * @type {undefined|null|string}
         */
        this.description = undefined;

        /**
         *
         * @type {undefined|null|Date}
         */
        this.end_at = undefined;

        /**
         *
         * @type {undefined|string}
         */
        this.name = undefined;

        /**
         *
         * @type {undefined|null|Date}
         */
        this.start_at = undefined;

        /**
         *
         * @type {undefined|null|string}
         */
        this.format = undefined;

        /**
         *
         * @type {undefined|null|string}
         */
        this.identifier = undefined;

        /**
         *
         * @type {undefined|string}
         */
        this.content = undefined;

        /**
         *
         * @type {undefined|null|File}
         */
        this.preview = undefined;


        /**
         *
         * @type {undefined|null|File}
         */
        this.metadata = undefined;

        this._playlists = new OrderedList("Playlist");
        this._pois = new List("Poi");
        this._tags = new List("Tag");

        Object.seal(this);
    }

    /**
     *
     * @returns {OrderedList<Playlist>}
     */
    get playlists() {
        return this._playlists;
    }

    /**
     *
     * @returns {List<Poi>}
     */
    get pois() {
        return this._pois;
    }

    /**
     *
     * @returns {List<Tag>}
     */
    get tags() {
        return this._tags;
    }
}

module.exports = MediaTextPattern;
