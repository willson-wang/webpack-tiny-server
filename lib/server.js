const http = require('http');
const webpack = require('webpack');
const Express = require('express');
const validateOptions = require('schema-utils');
const killable = require('killable');
const webpackDevHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const httpProxyMiddleware = require('http-proxy-middleware');
const createLog = require('./utils/createLog');
const schema = require('./options.json');
const status = require('./utils/status');
const normalizeOptions = require('./utils/normalizeOptions');
const updateCompiler = require('./utils/updateCompiler');
const createDomain = require('./utils/createDomain');

class Server {
    constructor (compiler, options = {}, _log) {
        validateOptions(schema, options, 'webpack-tiny-server');
        this.compiler = compiler;
        this.options = options;

        this.log = _log || createLog(options);

        normalizeOptions(this.compiler, this.options);

        updateCompiler(this.compiler, this.options);

        this.originalStats = this.options.stats && Object.keys(this.options.stats).length
            ? this.options.stats
            : {};

        this.contentBaseWatcher = [];

        this.hot = this.options.hot;
        this.header = this.options.header;
        this.progress = this.options.progress;

        this.clientOverlay = this.options.overlay;
        this.clientLogLevel = this.options.clientLogLevel;

        this.publicHost = this.options.public;

        this.watchOptions = this.options.watchOptions;

        if (this.progress) {
            this.setProgressPlugin();
        }

        this.setupApp();
        this.setupDevMiddleware();
        this.setupMiddleware();

        if (this.options.hot) {
            this.setupDevHotMiddleware();
            this.setupHotMiddleware();
        }
        if (this.options.proxy) {
            this.setupProxyFeature();
        }
        this.createServer();

        killable(this.listeningApp);
    }

    setProgressPlugin () {
        new webpack.ProgressPlugin({
            profile: !!this.options.profile
        }).apply(this.compiler);
    }

    setupApp () {
        this.app = new Express();
    }

    setupDevMiddleware () {
        this.middleware = webpackDevMiddleware(this.compiler, {
            ...this.options,
            logLevel: this.log.options.level
        });
    }

    setupDevHotMiddleware () {
        this.hotMiddleware = webpackDevHotMiddleware(this.compiler, {
            ...this.options
        });
    }

    setupProxyFeature () {
        /**
         * Assume a proxy configuration specified as:
         * proxy: {
         *   'context': { options }
         * }
         * OR
         * proxy: {
         *   'context': 'target'
         * }
         */
        if (!Array.isArray(this.options.proxy)) {
            if (Object.prototype.hasOwnProperty.call(this.options.proxy, 'target')) {
                this.options.proxy = [this.options.proxy];
            } else {
                this.options.proxy = Object.keys(this.options.proxy).map((context) => {
                    let proxyOptions;
                    // For backwards compatibility reasons.
                    const correctedContext = context
                        .replace(/^\*$/, '**')
                        .replace(/\/\*$/, '');

                    if (typeof this.options.proxy[context] === 'string') {
                        proxyOptions = {
                            context: correctedContext,
                            target: this.options.proxy[context]
                        };
                    } else {
                        proxyOptions = Object.assign({}, this.options.proxy[context]);
                        proxyOptions.context = correctedContext;
                    }

                    proxyOptions.logLevel = proxyOptions.logLevel || 'warn';

                    return proxyOptions;
                });
            }
        }

        const getProxyMiddleware = (proxyConfig) => {
            const context = proxyConfig.context || proxyConfig.path;

            // It is possible to use the `bypass` method without a `target`.
            // However, the proxy middleware has no use in this case, and will fail to instantiate.
            if (proxyConfig.target) {
                return httpProxyMiddleware(context, proxyConfig);
            }
        };
        /**
         * Assume a proxy configuration specified as:
         * proxy: [
         *   {
         *     context: ...,
         *     ...options...
         *   },
         *   // or:
         *   function() {
         *     return {
         *       context: ...,
         *       ...options...
         *     };
         *   }
         * ]
         */
        this.options.proxy.forEach((proxyConfigOrCallback) => {
            let proxyMiddleware;

            let proxyConfig =
            typeof proxyConfigOrCallback === 'function'
                ? proxyConfigOrCallback()
                : proxyConfigOrCallback;

            proxyMiddleware = getProxyMiddleware(proxyConfig);

            if (proxyConfig.ws) {
                this.websocketProxies.push(proxyMiddleware);
            }

            this.app.use((req, res, next) => {
                if (typeof proxyConfigOrCallback === 'function') {
                    const newProxyConfig = proxyConfigOrCallback();

                    if (newProxyConfig !== proxyConfig) {
                        proxyConfig = newProxyConfig;
                        proxyMiddleware = getProxyMiddleware(proxyConfig);
                    }
                }

                // - Check if we have a bypass function defined
                // - In case the bypass function is defined we'll retrieve the
                // bypassUrl from it otherwise bypassUrl would be null
                const isByPassFuncDefined = typeof proxyConfig.bypass === 'function';
                const bypassUrl = isByPassFuncDefined
                    ? proxyConfig.bypass(req, res, proxyConfig)
                    : null;

                if (typeof bypassUrl === 'boolean') {
                    // skip the proxy
                    req.url = null;
                    next();
                } else if (typeof bypassUrl === 'string') {
                    // byPass to that url
                    req.url = bypassUrl;
                    next();
                } else if (proxyMiddleware) {
                    return proxyMiddleware(req, res, next);
                } else {
                    next();
                }
            });
        });
    }

    setupMiddleware () {
        this.app.use(this.middleware);
    }

    setupHotMiddleware () {
        this.app.use(this.hotMiddleware);
    }

    showStatus () {
        const uri = `${createDomain(this.options, this.listeningApp)}/`;

        status(
            uri,
            this.options,
            this.log,
            this.options.stats && this.options.stats.colors
        );
    }

    createServer () {
        this.listeningApp = http.createServer(this.app);
    }

    listen (port, hostname, fn) {
        this.hostname = hostname;
        return this.listeningApp.listen(port, hostname, (err) => {
            this.showStatus();
            if (fn) {
                fn.call(this.listeningApp, err);
            }

            if (typeof this.options.onListening === 'function') {
                this.options.onListening(this);
            }
        });
    }
}

module.exports = Server;
