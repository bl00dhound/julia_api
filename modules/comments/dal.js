const R = require('ramda');

const db = require('../../providers/db');

const dal = {
	create: data => db('comments')
		.insert(data)
		.returning('*')
		.then(R.head),
	getById: id => db('comments')
		.first()
		.where({ id })
		.whereNull('removed_at'),
	remove: id => db('comments')
		.update({ removed_at: new Date() })
		.where({ id })
		.returning('*')
		.then(R.head),
	list: ({
		offset = 0,
		limit = 20
	}, article_id) => {
		const query = db('comments as c')
			.select(
				'c.*'
			)
			.leftJoin('users as u', 'u.id', 'c.author_id')
			.where({ article_id });
		return query
			.offset(offset)
			.limit(limit);
	}
};

module.exports = dal;
