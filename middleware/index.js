const pino = require('pino');

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

module.exports = { logger, checkRequestBody, responseHeaders };
