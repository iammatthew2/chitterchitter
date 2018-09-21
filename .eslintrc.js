// $ cat .eslintrc.js 
module.exports = {
  'env': {
      'node': true,
      'es6': true
  },
  'extends': 'google',
  'rules': {
    'arrow-parens': [2, 'as-needed'],
    'prefer-template': 2,
    'new-cap': ["error", { "properties": false }],
    'max-len': ["error", { "code": 90 }],
  },
  'globals': {
      // // Collections
      // 'Persons': true,
      // 'Modules': true,
      
      // // More stuff
      // // [...]

      // // Packages
      // 'lodash': true,
      // 'i18n': true,
      // 'moment': true,
      // 'Messenger': true
  }
}