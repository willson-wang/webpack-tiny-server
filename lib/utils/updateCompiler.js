// 检测是否添加HotModuleReplacementPlugin插件、及添加在entry入口添加webpack-hot-middleware/client
const webpack = require('webpack');
const addEntries = require('./addEntries');

const findHMRPlugin = (config) => {
    if (!config.plugins) {
        return undefined;
    }
    return config.plugins.find((plugin) => {
        return plugin.constructor === webpack.HotModuleReplacementPlugin;
    });
};

function updateCompiler (compiler, options) {
    if (options.hot !== false) {
        const compilers = [];
        const compilersWithoutHMR = [];
        let webpackConfig;

        if (compiler.compilers) {
            webpackConfig = [];
            compiler.compilers.forEach((compiler) => {
                webpackConfig.push(compiler.options);
                compilers.push(compiler);
                if (!findHMRPlugin(compiler.options)) {
                    compilersWithoutHMR.push(compiler);
                }
            });
        } else {
            webpackConfig = compiler.options;
            compilers.push(compiler);
            if (!findHMRPlugin(compiler.options)) {
                compilersWithoutHMR.push(compiler);
            }
        }

        addEntries(webpackConfig, options);

        compilers.forEach((compiler) => {
            const config = compiler.options;
            compiler.hooks.entryOption.call(config.context, config.entry);
        });

        if (options.hot) {
            compilersWithoutHMR.forEach((compiler) => {
                // addDevServerEntrypoints above should have added the plugin
                // to the compiler options
                const plugin = findHMRPlugin(compiler.options);
                if (plugin) {
                    plugin.apply(compiler);
                }
            });
        }
    }
}

module.exports = updateCompiler;
