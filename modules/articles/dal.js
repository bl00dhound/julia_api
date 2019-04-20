const R = require('ramda');

const db = require('../../providers/db');

const dal = {
	create: data => db('articles')
		.insert(data)
		.returning('*')
		.then(R.head),
	list: ({
		sort,
		// filter,
		search,
		offset = 0,
		limit = 20
	}) => {
		const query = db('articles as a')
			.select(
				'a.*',
				'u.email as author_email',
				'u.nickname as author_nickname',
				db.raw('count(1) over() as total_count')
			)
			.leftJoin('users as u', 'u.id', 'a.author_id');

		const orderables = {
			likes: 'l.total',
			comments: 'c.total',
			date: 'a.updated_at'
		};
		const direction = {
			desc: 'desc',
			asc: 'asc'
		};

		if (sort) {
			const [field, direct] = sort;
			query.orderBy(orderables[field], direction[direct]);
		}

		if (search) {
			query.whereRaw('a.title ilike ?', [`%${search}%`]);
		}

		return query
			.offset(offset)
			.limit(limit)
			.whereNull('a.removed_at');
	}
};

module.exports = dal;
