const R = require('ramda');
const httpErrors = require('http-errors');

const dal = require('./dal');
const { validate, validateUpdate } = require('./validate');
const roles = require('../../enums/roles');

const service = {
	create: (data, author_id) => {
		return validate({ ...data, author_id })
			.then(dal.create);
	},
	update: async (id, data, user_id) => {
		const oldData = await service.getById(id);
		if (R.isEmpty(oldData)
			|| R.isNil(oldData)
			|| oldData.author_id !== user_id) throw httpErrors.BadRequest();
		return validateUpdate({ ...data, id })
			.then(dal.update);
	},
	getById: dal.getById,
	remove: async (id, user) => {
		const oldData = await service.getById(id);
		if (R.isEmpty(oldData)
			|| R.isNil(oldData)
			|| (oldData.author_id !== user.id && user.role !== roles.admin)) throw httpErrors.BadRequest();
		return dal.remove(id);
	},
	list: dal.list
};

module.exports = service;
