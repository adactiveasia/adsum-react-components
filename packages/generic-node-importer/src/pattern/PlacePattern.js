const ACA = require("adsum-client-api");
const AbstractPattern = require("./AbstractPattern");
const OrderedList = require('./structure/OrderedList');
const List = require('./structure/List');

/**
 *
 */
class PlacePattern extends AbstractPattern {

    /**
     * @inheritDoc
     */
    static _getRepositoryName() {
        return "Place";
    }

    /**
     * @inheritDoc
     */
    static _getEntityConstructor() {
        return ACA.Place;
    }

    /**
     * @inheritDoc
     */
    static _getKeys() {
        return [
            "name",
            "signature",
            "metadata",
            "pois",
            "building_id",
            "floor_id",
            "shape_id",
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

        /**
         *
         * @type {undefined|Object}
         */
        this.metadata = undefined;

        /**
         *
         * @type {undefined|null|int}
         */
        this.building_id = undefined;

        /**
         *
         * @type {undefined|null|int}
         */
        this.floor_id = undefined;
        /**
         *
         * @type {undefined|null|int}
         */
        this.shape_id = undefined;

        /**
         *
         * @type {undefined|null|int}
         */
        this.rank = undefined;
        this._pois = new List("Poi");
        Object.seal(this);
    }

    /**
     *
     * @returns {List<Poi>}
     */
    get pois() {
        return this._pois;
    }
}

module.exports = PlacePattern;
