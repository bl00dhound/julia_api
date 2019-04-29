const passport = require('passport');
const httpError = require('http-errors');

module.exports = (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user) => {
	if (err) throw new httpError.BadRequest();
	req.user = user || {};
	return next();
})(req, res, next);
