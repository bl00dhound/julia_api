const R = require('ramda');

const ajv = require('../../services/validation');
const roles = require('../../enums/roles');

const updateProperties = {
	id: {
		type: 'integer',
		minimum: 1
	},
	email: {
		type: ['string', 'null'],
		format: 'email',
		minLength: 1,
		maxLength: 255,
		checkUpdateEmail: { $data: '1' }
	},
	phone: {
		type: ['string', 'null'],
		minLength: 6,
		maxLength: 20
	}
};

const validateUpdate = ajv.compile({
	$async: true,
	properties: updateProperties,
	additionalProperties: false,
	required: ['id']
});

const validateUpdateByAdmin = ajv.compile({
	$async: true,
	properties: {
		...updateProperties,
		role: {
			type: ['string', 'null'],
			enums: R.values(roles)
		}
	},
	additionalProperties: false,
	required: ['id']
});

const registration = ajv.compile({
	$async: true,
	properties: {
		email: {
			type: 'string',
			format: 'email',
			minLength: 1,
			maxLength: 255,
			checkUniqueEmail: { $data: '1' }
		},
		nickname: {
			type: 'string',
			minLength: 3,
			maxLength: 30,
			checkUniqueNickname: { $data: '1' }
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
		}
	},
	additionalProperties: false,
	required: ['nickname', 'email', 'password']
});

module.exports = {
	registration,
	validateUpdate,
	validateUpdateByAdmin
};
