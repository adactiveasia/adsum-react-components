const File = require("./File");

/**
 *
 */
class OrderedFileList {
    /**
     *
     */
    constructor() {
        this.list = undefined;

        Object.seal(this);
    }

    /**
     *
     * @param {File} pattern
     * @private
     */
    _assertIsSupportedPattern(pattern) {
        if (!(pattern instanceof File)) {
            throw new Error("OrderedFileList expected only File structure");
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
     * @param {File} pattern
     * @param {number} [position=0]
     */
    add(pattern, position = 0) {
        this._assertIsSupportedPattern(pattern);
        this._init();

        this.list.push({pattern, position});
    }
}

module.exports = OrderedFileList;
