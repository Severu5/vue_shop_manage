module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 'off',
    'space-before-function-paren': ['off', 'ignore'],
    'indent': ['off', 'ignore'],
    'no-unused-vars': ['off', 'ignore'],
    'spaced-comment': ['off']
  }
}
