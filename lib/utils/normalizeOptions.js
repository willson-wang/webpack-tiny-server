function normalizeOptions (compiler, options) {
    options.contentBase = options.contentBase !== undefined ? options.contentBase : process.pwd();

    options.contentBasePublicPath = options.contentBasePublicPath || '/';

    if (!options.watchOptions) {
        options.watchOptions = {};
    }
}

module.exports = normalizeOptions;
