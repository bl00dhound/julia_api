const R = require('ramda');
const httpErrors = require('http-errors');

const dal = require('./dal');
const { validate } = require('./validate');
const roles = require('../../enums/roles');

const service = {
	create: (data, author_id) => {
		return validate({ ...data, author_id })
			.then(dal.create);
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
