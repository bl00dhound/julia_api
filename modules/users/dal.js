const R = require('ramda');

const db = require('../../providers/db');

const dal = {
	findByNickname: nickname => {
		return db('users')
			.first('*')
			.whereNull('removed_at')
			.andWhere({ nickname });
	},
	create: user => {
		return db('users')
			.insert(user)
			.returning('*')
			.then(R.head)
			.then(R.dissoc(['password']));
	},
	list: () => {
		return db('users')
			.select(
				'id',
				'created_at',
				'updated_at',
				'email',
				'nickname',
				'phone',
				'role'
			);
	},
	getById: id => {
		return db('users')
			.first(
				'id',
				'created_at',
				'updated_at',
				'email',
				'nickname',
				'phone',
				'role'
			)
			.whereNull('removed_at')
			.andWhere({ id });
	}
};

module.exports = dal;
