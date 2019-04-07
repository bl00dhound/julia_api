const errors = require('http-errors');
const Ajv = require('ajv');
const R = require('ramda');

const prepareErrorMessages = R.map(R.pick(['keyword', 'dataPath', 'message']));

// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
	if (err instanceof errors.HttpError) {
		return res.status(err.statusCode).send(err.message);
	}
	if (err instanceof Ajv.ValidationError) {
		const messages = prepareErrorMessages(err.errors);
		return res.status(400).json(messages);
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
