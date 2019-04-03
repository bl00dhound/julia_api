const knex = require('knex');

const log = require('./log');
const config = require('../knexfile');

const db = knex(config);

if (process.env.NODE_ENV === 'development') {
	db.on('query', e => process.env.DEBUG_DB && log.info('db query', { sql: e.sql, bindings: e.bindings }));
}

log.info(db.client.config.connection);

module.exports = db;

module.exports.checkConnection = () => db.raw('select 1')
	.catch((error) => {
		log.error(error);
		log.error(db.client.config.connection);
		log.error('db connection error', () => process.exit(1));
	});
