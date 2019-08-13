/**
 *
 */
class OrderedList {
    /**
     *
     * @param {string} repositoryName
     */
    constructor(repositoryName) {
        this._repositoryName = repositoryName;
        this.list = undefined;

        Object.seal(this);
    }

    /**
     *
     * @param {AbstractPattern} pattern
     * @private
     */
    _assertIsSupportedPattern(pattern) {
        if (pattern.constructor._getRepositoryName() !== this._repositoryName) {
            throw new Error(`This list expected only pattern of repository "${this._repositoryName}"`);
        }
    }

    /**
     *
     * @private
     */
    _init() {
        if (!this.list) {
            this.list = [];
        }
    }

    /**
     *
     * @param {AbstractPattern} pattern
     * @param {number} [position=0]
     */
    add(pattern, position = 0) {
        this._assertIsSupportedPattern(pattern);
        this._init();

        this.list.push({pattern, position});
    }
}

module.exports = OrderedList;
