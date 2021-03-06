const logger = require('webpack-log');
const runOpen = require('./runOpen');
const colors = require('./colors');

function status (uri, options, log, useColor) {
    if (options.quiet === true) {
        // Add temporary logger to output just the status of the dev server
        log = logger({
            name: 'wds',
            level: 'info',
            timestamp: options.logTime
        });
    }

    const contentBase = Array.isArray(options.contentBase)
        ? options.contentBase.join(', ')
        : options.contentBase;

    log.info(`Project is running at ${colors.info(useColor, uri)}`);

    log.info(
        `webpack output is served from ${colors.info(useColor, options.publicPath)}`
    );

    if (contentBase) {
        log.info(
            `Content not from webpack is served from ${colors.info(
                useColor,
                contentBase
            )}`
        );
    }

    if (options.historyApiFallback) {
        log.info(
            `404s will fallback to ${colors.info(
                useColor,
                options.historyApiFallback.index || '/index.html'
            )}`
        );
    }

    if (options.open) {
        runOpen(uri, options, log);
    }
}

module.exports = status;
