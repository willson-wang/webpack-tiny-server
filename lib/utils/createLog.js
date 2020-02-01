const log = require('webpack-log');

function createLog (options = {}) {
    let level = options.logLevel || 'info';
    if (options.noInfo === true) {
        level = 'warn';
    }

    if (options.quiet === true) {
        level = 'silent';
    }

    return log({
        name: 'wts',
        level,
        timestamp: options.logTime
    });
}

module.exports = createLog;
