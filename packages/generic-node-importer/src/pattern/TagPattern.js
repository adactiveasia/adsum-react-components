const ACA = require("@adactive/adsum-client-api");
const AbstractPattern = require("./AbstractPattern");
const OrderedList = require("./structure/OrderedList");
const List = require("./structure/List");

/**
 *
 */
class TagPattern extends AbstractPattern {

    /**
     * @inheritDoc
     */
    static _getRepositoryName() {
        return "Tag";
    }

    /**
     * @inheritDoc
     */
    static _getEntityConstructor() {
        return ACA.Tag;
    }

    /**
     * @inheritDoc
     */
    static _getKeys() {
        return [
            "name",
            "pois",
            "categories",
            "medias",
            "playlists",
            "signature"
        ];
    }

    /**
     * @inheritDoc
     */
    constructor(safe = false) {
        super(safe);

        /**
         *
         * @type {undefined|string}
         */
        this.name = undefined;

        this._pois = new List("Poi");
        this._categories = new List("Category");
        this._medias = new List("Media");
        this._playlists = new List("Playlist");

        Object.seal(this);
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
     * @returns {List<Category>}
     */
    get categories() {
        return this._categories;
    }

    /**
     *
     * @returns {List<Media>}
     */
    get medias() {
        return this._medias;
    }

    /**
     *
     * @returns {List<Playlist>}
     */
    get playlists() {
        return this._playlists;
    }
}

module.exports = TagPattern;
