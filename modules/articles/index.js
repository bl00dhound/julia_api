const R = require('ramda');

const dal = require('./dal');
const { validate } = require('./validate');

const service = {
	create: (data, id) => {
		return validate({ ...data, author_id: id })
			.then(dal.create);
	},
	list: (data, user_id = null) => {
		return dal.list(data, user_id)
			.then(rows => ({
				rows,
				total: R.pathOr(0, [0, 'total_count'])(rows)
			}));
	},
	like: dal.like,
	getById: dal.getById
};

module.exports = service;
