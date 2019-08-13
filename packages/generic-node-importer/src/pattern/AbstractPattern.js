/**
 * @abstract
 */
class AbstractPattern {
    /**
     * Get the related ACA repository where the pattern result has to be saved
     *
     * @abstract
     * @return {string}
     * @private
     */
    static _getRepositoryName() {
        throw new Error("AbstractPattern#_getRepositoryName must be implemented");
    }

    /**
     * Get the corresponding ACA entity for that pattern
     *
     * @abstract
     * @return {ACA.AbstractEntity.constructor}
     * @private
     */
    static _getEntityConstructor() {
        throw new Error("AbstractPattern#_getEntityConstructor must be implemented");
    }

    /**
     * Returns all properties of that pattern
     *
     * @abstract
     * @return {string[]}
     * @private
     */
    static _getKeys() {
        throw new Error("AbstractPattern#_getKeys must be implemented");
    }

    /**
     *
     */
    constructor(safe = false) {
        if (!safe) {
            console.warn("Creating a pattern by your own is not safe use AbstractClientImporter.getOrCreatePattern");
        }

        this._signature = null;
    }

    /**
     *
     * @returns {string}
     */
    get signature() {
        return this._signature;
    }

    /**
     *
     * @param {string} signature
     */
    set signature(signature) {
        this._signature = signature === null ? null : `${signature}`;
    }
}

module.exports = AbstractPattern;
