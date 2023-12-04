/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  root: true,
  extends: ['prettier', 'eslint:recommended'],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
