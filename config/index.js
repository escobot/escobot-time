require('dotenv').config();
const bunyan = require('bunyan');
const serviceAccessToken = require('crypto').randomBytes(16).toString('hex').slice(0, 32);

const log = {
    development: () => {
        return bunyan.createLogger({name: 'escobot-time-development', level: 'debug'});
    },
    production: () => {
        return bunyan.createLogger({name: 'escobot-time-production', level:'info'});
    },
    test: () => {
        return bunyan.createLogger({name: 'escobot-time-test', level: 'fatal'});
    }
};

module.exports = {
    geoToken: process.env.GEO_TOKEN,
    timeToken: process.env.TIME_TOKEN,
    escobotApiToken: process.env.ESCOBOT_API_TOKEN,
    serviceAccessToken: serviceAccessToken,
    log: (env) => {
        if(env) return log[env]();
        return log[process.env.NODE_ENV || 'development']();
    }
};