const db = require('../../providers/db');

const dal = {
	findByEmail: email => {
		return db('users')
			.select('*')
			.whereNotNull('removed_at')
			.andWhere({ email });
	}
};

module.exports = dal;
