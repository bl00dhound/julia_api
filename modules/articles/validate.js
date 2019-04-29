const ajv = require('../../services/validation');

const updatedFields = {
	title: {
		type: ['string', 'null'],
		minLength: 1,
		maxLength: 255
	},
	content: {
		type: ['string', 'null'],
		minLength: 1
	},
	tags: {
		type: ['array', 'null'],
		items: { type: 'string' }
	}
};

const validate = ajv.compile({
	$async: true,
	properties: {
		title: {
			type: 'string',
			minLength: 1,
			maxLength: 255
		},
		content: {
			type: 'string',
			minLength: 1
		},
		author_id: {
			type: 'integer'
		},
		tags: {
			type: ['array', 'null'],
			items: { type: 'string' }
		}
	},
	additionalProperties: false,
	required: ['title', 'content', 'author_id']
});

const validateUpdate = ajv.compile({
	$async: true,
	properties: {
		...updatedFields,
		id: {
			type: 'integer',
			minimum: 1
		}
	},
	additionalProperties: false,
	required: ['id']
});

module.exports = {
	validate,
	validateUpdate
};
