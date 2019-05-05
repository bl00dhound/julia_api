const bcrypt = require('bcrypt');
const httpError = require('http-errors');
const R = require('ramda');
const jwt = require('jsonwebtoken');

const dal = require('./dal');
const checkingFields = R.values(require('../../enums/checking-fields'));
const {
	registration,
	validateUpdate,
	validateUpdateByAdmin
} = require('./validate.js');

const service = {
	passportLogin: (nickname, password) => {
		if (!nickname || !password) {
			throw new httpError.BadRequest();
		}
		return dal.findByNickname(nickname)
			.then(async user => {
				if (R.isEmpty(user)) throw new httpError.Unauthorized();
				if (!(await bcrypt.compare(password, user.password)))	{
					throw new httpError.Unauthorized();
				}
				return R.dissoc(['password'])(user);
			});
	},
	checkIfFieldUnique: (field, data) => {
		if (!field || !data || !checkingFields.includes(field)) throw httpError(400, 'wrong data');

		return dal.checkIfFieldUnique(field, data)
			.then(R.isNil);
	},
	registration: user => {
		if (!user.isAgree) throw new httpError.NotAcceptable();
		return registration(user)
			.then(async validatedUser => {
				return dal.create({
					...validatedUser,
					password: await bcrypt.hash(validatedUser.password, 10)
				});
			})
			.then(createdUser => ({
				...createdUser, token: jwt.sign({ id: createdUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
			}));
	},
	update: (data, user_id) => {
		return validateUpdate({ ...data, id: user_id })
			.then(dal.update);
	},
	updateByAdmin: (data, user_id) => {
		return validateUpdateByAdmin({ ...data, id: user_id })
			.then(dal.update);
	},
	list: dal.list,
	getById: dal.getById
};

module.exports = service;
