const ACA = require("adsum-client-api");
const AbstractPattern = require("./AbstractPattern");
const OrderedList = require('./structure/OrderedList');
const List = require('./structure/List');

/**
 *
 */
class MediaImagePattern extends AbstractPattern {

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
        return ACA.MediaImage;
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
            "file",
            "preview",
            "playlists",
            "pois",
            "tags",
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
         * @type {undefined|File}
         */
        this.file = undefined;

        /**
         *
         * @type {undefined|null|File}
         */
        this.preview = undefined;

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

module.exports = MediaImagePattern;
