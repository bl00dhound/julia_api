const Ajv = require('ajv');
const R = require('ramda');

const db = require('../providers/db');

const ajv = new Ajv({
	v5: true, // allows json schema features like $data to be used
	allErrors: true,
	removeAdditional: 'failing',
	coerceTypes: true,
	useDefaults: true,
	$data: true
});

ajv.addKeyword('checkUniqueEmail', {
	async: true,
	type: 'string',
	$data: true,
	validate: (reference, email) => {
		return db('users')
			.first('*')
			.where({ email })
			.then(R.isNil);
	}
});
ajv.addKeyword('checkUpdateEmail', {
	async: true,
	type: 'string',
	$data: true,
	validate: (reference, email) => {
		return db('users')
			.first('*')
			.where({ email })
			.andWhereNot({ id: reference.id })
			.then(R.isNil);
	}
});
ajv.addKeyword('checkUniqueNickname', {
	async: true,
	type: 'string',
	$data: true,
	validate: (reference, nickname) => {
		return db('users')
			.first('*')
			.where({ nickname })
			.then(R.isNil);
	}
});

module.exports = ajv;
