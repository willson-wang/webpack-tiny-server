#!/usr/bin/env node

// 启动文件
const yargs = require('yargs');
const webpack = require('webpack');
const getVersions = require('../lib/utils/getVersions');
const options = require('./options');
const Server = require('../lib/server');
const processOptions = require('../lib/utils/processOptions');
const createLog = require('../lib/utils/createLog');
const colors = require('../lib/utils/colors');

let server;

try {
    require.resolve('webpack-cli');
} catch (err) {
    console.error('The CLI moved into a separate package: webpack-cli');
    console.error(
        "Please install 'webpack-cli' in addition to webpack itself to use the CLI"
    );
    console.error('-> When using npm: npm i -D webpack-cli');
    console.error('-> When using yarn: yarn add -D webpack-cli');

    process.exitCode = 1;
}

yargs.usage(
    `${getVersions()}\nUsage:  https://webpack.js.org/configuration/dev-server/`
);

yargs.version(getVersions());

let configYargsPath;

try {
    require.resolve('webpack-cli/bin/config/config-yargs');
    configYargsPath = 'webpack-cli/bin/config/config-yargs';
} catch (error) {
    configYargsPath = 'webpack-cli/bin/config-yargs';
}

require(configYargsPath)(yargs);

yargs.options(options);

const argv = yargs.argv;

let convertArgvPath;

try {
    require.resolve('webpack-cli/bin/utils/convert-argv');
    convertArgvPath = 'webpack-cli/bin/utils/convert-argv';
} catch (error) {
    convertArgvPath = 'webpack-cli/bin/convert-argv';
}

const config = require(convertArgvPath)(yargs, argv, {
    outputFilename: '/bundle.js'
});

function startServer (config, options) {
    const log = createLog(options);

    let compiler;
    try {
        compiler = webpack(config);
    } catch (error) {
        if (error instanceof webpack.WebpackOptionsValidationError) {
            log.error(colors.error(options.stats.colors, error.message));
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }

        throw error;
    }

    try {
        server = new Server(compiler, options, log);
    } catch (err) {
        if (err.name === 'ValidationError') {
            log.error(colors.error(options.stats.colors, err.message));
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }

        throw err;
    }

    server.listen(options.port, options.host, (err) => {
        if (err) {
            throw err;
        }
    });
}

processOptions(config, argv, (config, options) => {
    startServer(config, options);
});
