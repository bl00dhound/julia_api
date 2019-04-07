const errors = require('http-errors');

// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
	if (err instanceof errors.HttpError) {
		return res.status(err.statusCode).send(err.message);
	}

	if (typeof (err) === 'string') {
		return res.status(400).json({
			message: err
		});
	}
	if (err.name === 'UnauthorizedError') {
		return res.status(401).json({
			message: 'Invalid Token'
		});
	}
	return res.status(500).json({
		message: err.message
	});
};
