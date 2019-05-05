const R = require('ramda');

const db = require('../../providers/db');

const dal = {
	create: data => db('articles')
		.insert(data)
		.returning('*')
		.then(R.head),
	getById: (id, user_id = null) => {
		const fields = [
			'a.*',
			db.raw(`coalesce((select count(user_id) from likes as l
			where article_id = ? group by article_id), 0) as like_count`, [id]),
			'u.email as author_email',
			'u.nickname as author_nickname',
			db.raw(`(coalesce((select count(c.id) from comments as c
				where c.article_id = a.id group by c.article_id), 0)) as comment_count`)
		];

		fields.push(db.raw('(case when l.article_id is not null then true else false end) as is_liked'));

		const query = db('articles as a')
			.first(fields)
			.leftJoin('users as u', 'u.id', 'a.author_id')
			.whereNull('a.removed_at')
			.andWhere('a.id', id);

		query.leftJoin('likes as l', function () {
			this.on('l.article_id', '=', 'a.id')
				.andOn(db.raw('l.user_id = ?', [user_id]));
		});

		return query;
	},
	update: data => {
		const updatedData = R.compose(
			R.assoc('updated_at', new Date()),
			R.dissoc(['id'])
		)(data);
		return db('articles')
			.update(updatedData)
			.where({ id: data.id })
			.returning('*')
			.then(R.head)
			.then(R.dissoc(['password']));
	},
	remove: id => {
		return db('articles')
			.update({ removed_at: new Date() })
			.where({ id })
			.returning('*')
			.then(R.head)
			.then(R.dissoc(['password']));
	},
	list: ({
		sort,
		filters,
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
			db.raw(`(coalesce((select count(c.id) from comments as c
				where c.article_id = a.id group by c.article_id), 0)) as comment_count`)
		];

		if (user_id) {
			fields.push(db.raw('(case when l.article_id is not null then true else false end) as is_liked'));
		}

		const query = db('articles as a')
			.select(fields)
			.leftJoin('users as u', 'u.id', 'a.author_id');

		const filterables = {
			author_id: {
				reference: 'a.author_id',
				type: 'general'
			},
			status: {
				reference: 'a.status',
				type: 'general'
			},
			tag: {
				reference: 'a.tags',
				type: 'json'
			}
		};

		const orderables = {
			likes: 'like_count',
			comments: 'comment_count',
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

		if (filters) {
			R.compose(
				R.forEach(filter => {
					switch (filterables[filter].type) {
						case 'json':
							query.andWhere(function () {
								filters[filter].forEach(tag => {
									this.orWhere(db.raw('? = any(??)', [tag, filterables[filter].reference]));
								});
							});
							break;
						default:
							query.whereIn(filterables[filter].reference, filters[filter]);
							break;
					}
				}),
				R.keys
			)(filters);
		}

		if (sort) {
			const [field, direct] = sort;
			query.orderBy(orderables[field], direction[direct]);
		}

		if (search) {
			query.whereRaw(`a.title ilike :search
				or u.nickname ilike :search`, { search: `%${search}%` });
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
