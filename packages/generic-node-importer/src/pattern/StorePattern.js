const ACA = require("adsum-client-api");
const AbstractPattern = require("./AbstractPattern");
const OrderedList = require("./structure/OrderedList");
const List = require("./structure/List");
const OrderedFileList = require("./structure/OrderedFileList");

/**
 *
 */
class StorePattern extends AbstractPattern {

    /**
     * @inheritDoc
     */
    static _getRepositoryName() {
        return "Poi";
    }

    /**
     * @inheritDoc
     */
    static _getEntityConstructor() {
        return ACA.Store;
    }

    /**
     * @inheritDoc
     */
    static _getKeys() {
        return [
            "client_id",
            "description",
            "is_new",
            "metadata",
            "name",
            "opening_time",
            "phone",
            "priority",
            "signature",
            "url",
            "children",
            "parents",
            "categories",
            "custom_objects",
            "tags",
            "logos",
            "medias",
            "pictures",
            "places"
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
         * @type {undefined|bool}
         */
        this.is_new = undefined;

        /**
         *
         * @type {undefined|Object}
         */
        this.metadata = undefined;

        /**
         *
         * @type {undefined|string}
         */
        this.name = undefined;

        /**
         *
         * @type {undefined|null|string}
         */
        this.opening_time = undefined;

        /**
         *
         * @type {undefined|null|string}
         */
        this.phone = undefined;

        /**
         *
         * @type {undefined|int}
         */
        this.priority = undefined;

        /**
         *
         * @type {undefined|null|string}
         */
        this.url = undefined;

        this._children = new OrderedList("Poi");
        this._parents = new List("Poi");
        this._categories = new List("Category");
        this._custom_objects = new List("CustomObject");
        this._tags = new List("Tag");
        this._logos = new OrderedFileList("File");
        this._medias = new OrderedList("Media");
        this._pictures = new OrderedFileList();
        this._places = new List("Place");

        Object.seal(this);
    }

    /**
     *
     * @returns {OrderedList<Poi>}
     */
    get children() {
        return this._children;
    }

    /**
     *
     * @returns {List<Poi>}
     */
    get parents() {
        return this._parents;
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
     * @returns {List<CustomObject>}
     */
    get custom_objects() {
        return this._custom_objects;
    }

    /**
     *
     * @returns {List<Tag>}
     */
    get tags() {
        return this._tags;
    }

    /**
     *
     * @returns {OrderedFileList}
     */
    get logos() {
        return this._logos;
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
     * @returns {OrderedFileList}
     */
    get pictures() {
        return this._pictures;
    }

    /**
     *
     * @returns {List<Place>}
     */
    get places() {
        return this._places;
    }
}

module.exports = StorePattern;
