const files = new Set();

/**
 *
 */
class File {
    /**
     * Returns all created File
     *
     * @return {Set<File>}
     */
    static getAll() {
        return files;
    }

    /**
     *
     */
    constructor() {
        /**
         *
         * @type {undefined|string}
         */
        this.uri = undefined;

        /**
         *
         * @type {undefined|string}
         */
        this.name = undefined;

        files.add(this);

        Object.seal(this);
    }
}

module.exports = File;
