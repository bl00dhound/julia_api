const bcrypt = require('bcrypt');
const httpError = require('http-errors');
const R = require('ramda');
const jwt = require('jsonwebtoken');

const dal = require('./dal');
const validate = require('./validate.js');

const service = {
	login: (nickname, password) => {
		if (!nickname || !password) {
			throw new httpError.BadRequest();
		}
		return dal.findByNickname(nickname)
			.then(async user => {
				if (R.isEmpty(user)) throw new httpError.Unauthorized();
				if (!(await bcrypt.compare(password, user.password)))	{
					throw new httpError.Unauthorized();
				}
				const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET);
				return R.compose(R.assoc('token', token), R.dissoc(['password']))(user);
			});
	},
	registration: user => {
		if (!user.isAgree) throw new httpError.NotAcceptable();
		return validate.registration(user)
			.then(async validatedUser => {
				return dal.create({
					...validatedUser,
					password: await bcrypt.hash(validatedUser.password, 10)
				});
			});
	},
	list: dal.list,
	getById: dal.getById
};

module.exports = service;
