const Good = require('good');
const path = require('path');
const release = require(path.join(__dirname, '../package')).version;

exports.register = (server, options, next) => {
    const opts = {
        ops: {
            interval: 1000
        },
        reporters: {
            myConsoleReporter: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ error: '*', log: '*', response: '*', request: '*' }]
                },
                {
                    module: 'good-console'
                },
                'stdout'
            ],
            mySentryReporter: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ error: '*', log: '*', response: '*', request: '*' }],
                }, {
                    module: 'good-sentry',
                    args: [{
                        dsn: process.env.SENTRY_DSN,
                        config: {
                            name: 'timelapse-api',
                            logger: 'mySentryReporter',
                            release,
                            environment: process.env.NODE_ENV
                        }
                    }]
                }
            ]
        }
    };

    server.register({
        register: Good,
        options: opts,
    }, err => next(err));
};

exports.register.attributes = {
    name: 'logs',
    version: '1.0.0',
};
