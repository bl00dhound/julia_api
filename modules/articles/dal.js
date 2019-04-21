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
	}, user_id) => {
		const fields = [
			'a.*',
			'u.email as author_email',
			'u.nickname as author_nickname',
			db.raw('count(1) over() as total_count'),
			db.raw(`coalesce((select count(user_id) from likes as l
				where l.article_id = a.id
				group by l.article_id), 0) as like_count`),
			db.raw('(case when l.article_id is not null then true else false end) as is_liked')
		];
		const query = db('articles as a')
			.select(fields)
			.leftJoin('users as u', 'u.id', 'a.author_id');

		const orderables = {
			likes: 'like_count',
			// comments: 'c.total',
			date: 'a.updated_at'
		};
		const direction = {
			desc: 'desc',
			asc: 'asc'
		};

		if (user_id) {
			query.leftJoin('likes as l', function () {
				this.on('l.article_id', '=', 'a.id')
					.andOn(db.raw('l.user_id = ?', [user_id]));
			});
		}

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
	},
	like: (article_id, user_id) => {
		return db.transaction(trx => {
			return db('likes')
				.transacting(trx)
				.where({ article_id, user_id })
				.del()
				.returning('*')
				.then(rows => {
					if (!rows.length) {
						return db('likes')
							.transacting(trx)
							.insert({ article_id, user_id });
					}
					return true;
				});
		});
	}
};

module.exports = dal;