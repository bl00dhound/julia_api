const ajv = require('../../services/validation');

const validate = ajv.compile({
	$async: true,
	properties: {
		content: {
			type: 'string',
			minLength: 1
		},
		article_id: {
			type: 'integer'
		},
		author_id: {
			type: 'integer'
		},
		parent_id: {
			type: ['integer', 'null']
		}
	},
	additionalProperties: false,
	required: ['content', 'author_id', 'article_id']
});

const validateUpdate = ajv.compile({
	$async: true,
	properties: {
		id: {
			type: 'integer'
		},
		content: {
			type: ['string', 'null'],
			minLength: 1
		},
		parent_id: {
			type: ['integer', 'null']
		}
	},
	additionalProperties: false,
	required: ['id']
});

module.exports = {
	validate,
	validateUpdate
};
