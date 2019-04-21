const expressJwt = require('express-jwt');

module.exports = (/* _role */) => [
	expressJwt({
		secret: process.env.JWT_SECRET
	}).unless({
		path: [
			'/v1/session/login',
			'/v1/session/registration',
			'/v1/articles/list'
		]
	})
	// (req, res, next) => {
	// 	if (!role || role !== req.user.role) {
	// 		return res.send(401);
	// 	}
	// 	return next();
	// }
];
