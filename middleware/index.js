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

module.exports = { logger, checkRequestBody };
