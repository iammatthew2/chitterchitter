module.exports = {
  'env': {
      'node': true,
      'es6': true
  },
  'extends': ['eslint:recommended', 'google'],
  'rules': {
    'arrow-parens': [2, 'as-needed'],
    'prefer-template': 2,
    'new-cap': ["error", { "properties": false }],
    'max-len': ["error", { "code": 90 }],
    'object-curly-spacing': ["error", "always"],
    'no-console': 'off',
    'require-jsdoc': 'off',
  },

  "parserOptions": {
    "ecmaVersion": 2017
  },
  'globals': {
    'jest': true,
    'test': true,
    'beforeAll': true,
    'expect': true,
  }
}