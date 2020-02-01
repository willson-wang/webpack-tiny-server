const webpack = require('webpack');

function prependEntry (originEntry, additionalEntries) {
    if (typeof originEntry === 'function') {
        return () => {
            return Promise.resolve(originEntry()).then((entry) => {
                prependEntry(entry, additionalEntries);
            });
        };
    }

    if (typeof originEntry === 'object' && !Array.isArray(originEntry)) {
        const clone = {};

        Object.keys(originEntry).forEach((key) => {
            // entry[key] should be a string here
            clone[key] = prependEntry(originEntry[key], additionalEntries);
        });

        return clone;
    }

    const entriesClone = additionalEntries.slice(0);
    [].concat(originEntry).forEach((newEntry) => {
        if (!entriesClone.includes(newEntry)) {
            entriesClone.push(newEntry);
        }
    });
    return entriesClone;
}

function addEntries (config, options) {
    if (!options.hot) return;

    const hotEntry = 'webpack-hot-middleware/client';
    [].concat(config).forEach((config) => {
        config.entry = prependEntry(config.entry, [hotEntry]);
        if (options.hot) {
            config.plugins = config.plugins || [];
            if (
                !config.plugins.find((plugin) => plugin.constructor.name === 'HotModuleReplacementPlugin')
            ) {
                console.log('HotModuleReplacementPlugin');
                config.plugins.push(new webpack.HotModuleReplacementPlugin());
            }
        }
    });
}

module.exports = addEntries;
