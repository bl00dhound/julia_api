const expressJwt = require('express-jwt');

module.exports = role => [
	expressJwt({
		secret: process.env.JWT_SECRET
	}).unless({ path: ['/v1/session/authenticate'] }),
	(req, res, next) => {
		if (!role || role !== req.user.role) {
			return res.send(401);
		}
		return next();
	}
];
