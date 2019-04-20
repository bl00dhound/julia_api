const ajv = require('../../services/validation');

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

module.exports = {
	validate
};
