const url = require('url');
const ip = require('internal-ip');

function createDomain (options, server) {
    const protocol = 'http';
    const hostname = options.useLocalIp
        ? ip.v4.sync() || 'localhost'
        : options.host || 'localhost';

    const port = server ? server.address().port : 0;

    if (options.public) {
        return /^[a-zA-Z]+:\/\//.test(options.public)
            ? `${options.public}`
            : `${protocol}://${options.public}`;
    }
    return url.format({
        protocol,
        hostname,
        port
    });
}

module.exports = createDomain;
