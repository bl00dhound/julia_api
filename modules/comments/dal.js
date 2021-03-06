const R = require('ramda');

const db = require('../../providers/db');

const dal = {
	create: data => db('comments')
		.insert(data)
		.returning('*')
		.then(R.head),
	getById: id => db('comments as c')
		.first('c.*', 'u.email', 'u.nickname')
		.leftJoin('users as u', 'u.id', 'c.author_id')
		.where('c.id', id)
		.whereNull('c.removed_at'),
	update: data => {
		const updatedData = R.compose(
			R.assoc('updated_at', new Date()),
			R.dissoc(['id'])
		)(data);
		return db('comments')
			.update(updatedData)
			.where({ id: data.id })
			.returning('*')
			.then(R.head);
	},
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
				'c.*',
				'u.email',
				'u.nickname'
			)
			.leftJoin('users as u', 'u.id', 'c.author_id')
			.where({ article_id })
			.whereNull('c.removed_at');
		return query
			.offset(offset)
			.limit(limit);
	}
};

module.exports = dal;
