const winston = require('winston')
require('dotenv').config()

const logger = winston.createLogger({
	transports: [new winston.transports.Console({ handleExceptions: true, level: process.env.LOG_LEVEL })],
	exitOnError: false,
})

logger.on('error', (error, transport) => {
	console.log('Winston Logger crashed')
})

module.exports = logger
