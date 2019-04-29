const R = require('ramda');
const httpErrors = require('http-errors');

const roles = require('../enums/roles');

module.exports = (acceptedRoles = []) => ({ user }, res, next) => {
	if (R.isEmpty(acceptedRoles) || user.role === roles.admin) return next();
	if (R.isEmpty(user) || acceptedRoles.includes(roles.admin)) throw httpErrors.Unauthorized();
	return next();
};
