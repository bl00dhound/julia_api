const Ajv = require('ajv');

const ajv = new Ajv({
	v5: true, // allows json schema features like $data to be used
	allErrors: true,
	removeAdditional: true,
	coerceTypes: true,
	useDefaults: true
});

module.exports = ajv;
