module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
		"jasmine": true,
		"node": true, 
    },
    "extends": [
        "eslint:recommended",
        "plugin:json/recommended",
    ],
    "parserOptions": {
        "sourceType": "script"
    },
	"globals": {
		"atom": 'readonly',
		"waitsForPromise": "readonly",
	},
	rules: {
		'no-unused-vars': 'off',
	},
}
