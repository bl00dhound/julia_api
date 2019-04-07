const R = require('ramda');

const ajv = require('../../services/validation');
const roles = require('../../enums/roles');

const registration = ajv.compile({
	$async: true,
	properties: {
		email: {
			type: 'string',
			format: 'email',
			minLength: 1,
			maxLength: 255
		},
		nickname: {
			type: 'string',
			minLength: 3,
			maxLength: 30
		},
		password: {
			type: 'string',
			minLength: 4,
			maxLength: 60
		},
		phone: {
			type: ['string', 'null'],
			minLength: 6,
			maxLength: 20
		},
		role: {
			type: ['string', 'null'],
			enum: R.values(roles)
		}
	},
	additionalProperties: false,
	require: ['nickname', 'email', 'password']
});

module.exports = {
	registration
};
