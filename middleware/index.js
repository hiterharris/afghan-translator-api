require('dotenv').config();
const pino = require('pino');
const { blacklistedIPs } = require('../data/blacklistedIPs');
const moesif = require('moesif-nodejs');

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            ignore: 'pid, hostname'
        }
    }
})

const checkRequestBody = (req, res, next) => {
    const { text } = req.body;
    if (!text || text.trim() === '') {
        return res.status(400).json({
            error: {
                message: 'Please enter the text to translate.',
            },
        });
    }
    next();
}

const responseHeaders = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
}

const blacklist = (req, res) => {
    const requestIP = req.ip || req.connection.remoteAddress;

    if (blacklistedIPs.includes(requestIP)) {
        logger.info('Access forbidden: ', requestIP);
        return res.status(403).json({ message: 'Unknown error' });
    }
}

const moesifOptions = {
    applicationId: process.env.MOESIF_APPLICATION_ID,
    logBody: true,
    identifyUser: function (req, res) {
        return req.user ? req.user.id : undefined;
    },
    getSessionToken: function (req, res) {
        return req.headers['Authorization'];
    },
    getMetadata: function (req, res) {
        return {
          name: '',
          email: ''
        };
    }
};

const moesifMiddleware = moesif(moesifOptions);

module.exports = { logger, checkRequestBody, responseHeaders, blacklist, moesifMiddleware };
