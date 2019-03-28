module.exports = {
	extends: 'airbnb-base',
	rules: {
		'max-len': [2, {code: 120, tabWidth: 2}],
		indent: [2, 'tab', {SwitchCase: 1}],
		'no-tabs': 0,
		'comma-dangle': [2, 'never'],
    'comma-spacing': [2, {'before': false, 'after': true}]
	},
}
