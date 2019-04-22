const dal = require('./dal');
const { validate } = require('./validate');

const service = {
	create: (data, author_id) => {
		return validate({ ...data, author_id })
			.then(dal.create);
	},
	list: dal.list
};

module.exports = service;
