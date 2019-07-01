const ACA = require("adsum-client-api");
const AbstractPattern = require("./AbstractPattern");
const OrderedList = require('./structure/OrderedList');
const List = require('./structure/List');

/**
 *
 */
class PlaylistPattern extends AbstractPattern {

    /**
     * @inheritDoc
     */
    static _getRepositoryName() {
        return "Playlist";
    }

    /**
     * @inheritDoc
     */
    static _getEntityConstructor() {
        return ACA.Playlist;
    }

    /**
     * @inheritDoc
     */
    static _getKeys() {
        return [
            "client_id",
            "description",
            "name",
            "parameters",
            "signature",
            "medias",
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
         * @type {undefined|string}
         */
        this.name = undefined;

        /**
         *
         * @type {undefined|string[]}
         */
        this.parameters = undefined;

        this._medias = new OrderedList("Media");
        this._tags = new List("Tag");

        Object.seal(this);
    }

    /**
     *
     * @returns {OrderedList<Media>}
     */
    get medias() {
        return this._medias;
    }

    /**
     *
     * @returns {List<Media>}
     */
    get tags() {
        return this._tags;
    }
}

module.exports = PlaylistPattern;
