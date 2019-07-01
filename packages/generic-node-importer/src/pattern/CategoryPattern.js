const ACA = require("adsum-client-api");
const AbstractPattern = require("./AbstractPattern");
const OrderedList = require('./structure/OrderedList');
const List = require('./structure/List');

/**
 *
 */
class CategoryPattern extends AbstractPattern {

    /**
     * @inheritDoc
     */
    static _getRepositoryName() {
        return "Category";
    }

    /**
     * @inheritDoc
     */
    static _getEntityConstructor() {
        return ACA.Category;
    }

    /**
     * @inheritDoc
     */
    static _getKeys() {
        return [
            "children",
            "client_id",
            "color",
            "logo",
            "metadata",
            "name",
            "parameters",
            "parents",
            "pois",
            "signature",
            "tags",
            "type",
        ];
    }

    /**
     * @inheritDoc
     */
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
        this.color = undefined;

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
         * @type {undefined|string[]}
         */
        this.parameters = undefined;

        /**
         *
         * @type {undefined|null|int}
         */
        this.rank = undefined;

        /**
         *
         * @type {undefined|null|string}
         */
        this.type = undefined;

        /**
         *
         * @type {undefined|null|File}
         */
        this.logo = undefined;

        this._children = new OrderedList("Category");
        this._parents = new List("Category");
        this._pois = new List("Poi");
        this._tags = new List("Tag");

        Object.seal(this);
    }

    /**
     *
     * @returns {OrderedList<Category>}
     */
    get children() {
        return this._children;
    }

    /**
     *
     * @returns {List<Category>}
     */
    get parents() {
        return this._parents;
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

module.exports = CategoryPattern;
