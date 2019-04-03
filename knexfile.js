require('dotenv').config();
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	client: 'pg',
	connection: {
		port: isProduction ? process.env.POSTGRES_PORT : 15432,
		host: isProduction ? process.env.CNFG_DB__CONNECTION__HOST : '127.0.0.1',
		database: process.env.POSTGRES_DB,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD
	},
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		directory: path.join(__dirname, 'migrations'),
		tableName: 'migrations'
	}
};
