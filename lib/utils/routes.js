'use strict';

const { createReadStream } = require('fs');
const { join } = require('path');

const clientBasePath = join(__dirname, '..', '..', 'client');

function routes (app, middleware, options) {
    app.get('/webpack-tiny-server/*', (req, res) => {
        res.setHeader('Content-Type', 'text/html');

        createReadStream(join(clientBasePath, 'index.html')).pipe(res);
    });
}

module.exports = routes;
