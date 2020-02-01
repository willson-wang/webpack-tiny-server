const DISPLAY_GROUP = 'Stats options:';
const CONNECTION_GROUP = 'Connection options:';
const RESPONSE_GROUP = 'Response options:';
const BASIC_GROUP = 'Basic options:';

module.exports = {
    devServer: [
        {
            name: 'profile',
            type: Boolean,
            describe: 'Print compilation profile data for progress steps'
        },
        {
            name: 'hot',
            type: Boolean,
            describe: 'disable or enable HMR'
        },
        {
            name: 'progress',
            type: Boolean,
            describe: 'Print compilation progress in percentage',
            group: BASIC_GROUP
        },
        {
            name: 'stdin',
            type: Boolean,
            describe: 'close when stdin ends'
        },
        {
            name: 'open',
            type: String,
            describe:
        'Open the default browser, or optionally specify a browser name'
        },
        {
            name: 'useLocalIp',
            type: Boolean,
            describe: 'Open default browser with local IP'
        },
        {
            name: 'open-page',
            type: String,
            describe: 'Open default browser with the specified page'
        },
        {
            name: 'client-log-level',
            type: String,
            group: DISPLAY_GROUP,
            defaultValue: 'info',
            describe:
        'Log level in the browser (trace, debug, info, warn, error or silent)'
        },
        {
            name: 'content-base',
            type: String,
            describe: 'A directory or URL to serve HTML content from.',
            group: RESPONSE_GROUP
        },
        {
            name: 'watch-content-base',
            type: Boolean,
            describe: 'Enable live-reloading of the content-base.',
            group: RESPONSE_GROUP
        },
        {
            name: 'history-api-fallback',
            type: Boolean,
            describe: 'Fallback to /index.html for Single Page Applications.',
            group: RESPONSE_GROUP
        },
        {
            name: 'compress',
            type: Boolean,
            describe: 'Enable gzip compression',
            group: RESPONSE_GROUP
        },
        // findPort is currently not set up
        {
            name: 'port',
            type: Number,
            describe: 'The port',
            group: CONNECTION_GROUP
        },
        {
            name: 'public',
            type: String,
            describe: 'The public hostname/ip address of the server',
            group: CONNECTION_GROUP
        },
        {
            name: 'host',
            type: String,
            describe: 'The hostname/ip address the server will bind to',
            group: CONNECTION_GROUP
        }
    ]
};
