const pino = require('pino');
const winston = require('winston');

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
            ignore: 'pid, hostname'
        }
    }
})


const wLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'log.json' }),
    new winston.transports.Console()
  ]
});

module.exports = { logger, wLogger };