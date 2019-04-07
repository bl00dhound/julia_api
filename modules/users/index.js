const bcrypt = require('bcrypt');
const httpError = require('http-errors');
const R = require('ramda');
const jwt = require('jsonwebtoken');


const dal = require('./dal');

const service = {
	authenticate: (email, password) => {
		if (!email || !password) {
			throw new httpError.BadRequest();
		}
		return dal.findByEmail(email)
			.then(async user => {
				if (R.isEmpty(user)) throw new httpError.Unauthorized();
				if (!(await bcrypt.compare(password, user.password)))	{
					throw new httpError.Unauthorized();
				}
				const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET);
				return R.compose(R.assoc(token, token), R.dissoc(['password']))(user);
			});
	}
};

module.exports = service;
