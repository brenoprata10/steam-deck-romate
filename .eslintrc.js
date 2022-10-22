module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier'
	],
	'overrides': [
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		project: 'tsconfig.json',
		sourceType: 'module'
	},
	'plugins': [
		'react',
		'@typescript-eslint',
		'eslint-plugin-import',
		'eslint-plugin-jsdoc',
		'eslint-plugin-prefer-arrow',
		'eslint-plugin-react',
		'react-hooks',
		'prettier'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		"no-multiple-empty-lines": ["error", { "max": 1, "maxBOF": 0, "maxEOF": 0 }],
		"react/react-in-jsx-scope": "off",
		"react/jsx-filename-extension": [1, { "extensions": [".ts", ".tsx"] }],
	}
}
