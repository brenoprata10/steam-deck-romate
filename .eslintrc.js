module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier'
	],
	ignorePatterns: [".erb/*"],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module'
	},
	plugins: [
		'react',
		'@typescript-eslint',
		'eslint-plugin-import',
		'eslint-plugin-jsdoc',
		'eslint-plugin-prefer-arrow',
		'eslint-plugin-react',
		'react-hooks',
		'prettier'
	],
	rules: {
		indent: 'off',
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'no-multiple-empty-lines': ['error', {max: 1, maxBOF: 0, maxEOF: 0}],
		'react/react-in-jsx-scope': 'off',
		'react/jsx-filename-extension': [1, {extensions: ['.ts', '.tsx']}],
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "error",
		'prettier/prettier': 'error',
		'@typescript-eslint/parser': 'off',
		'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
		'@typescript-eslint/ban-ts-comment': 'off'
	}
}
