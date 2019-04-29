const R = require('ramda');
const httpErrors = require('http-errors');

const dal = require('./dal');
const roles = require('../../enums/roles');
const { validate, validateUpdate } = require('./validate');

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
	remove: async (id, user) => {
		const oldData = await service.getById(id);
		if (R.isEmpty(oldData)
			|| R.isNil(oldData)
			|| (oldData.author_id !== user.id && user.role !== roles.admin)) throw httpErrors.BadRequest();
		return dal.remove(id);
	},
	update: async (id, data, user_id) => {
		const oldData = await service.getById(id);
		if (R.isEmpty(oldData)
			|| R.isNil(oldData)
			|| oldData.author_id !== user_id) throw httpErrors.BadRequest();
		return validateUpdate({ ...data, id })
			.then(dal.update);
	},
	like: dal.like,
	getById: dal.getById
};

module.exports = service;
