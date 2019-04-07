const winston = require('winston');
const moment = require('moment');

const transports = [
	new winston.transports.Console({
		handleExceptions: true,
		humanReadableUnhandledException: true,
		timestamp: () => moment().format(),
		json: true,
		stringify: true
	})
];

const logger = winston.createLogger({
	transports,
	exitOnError: false
});

module.exports = logger;
