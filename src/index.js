/**
 * @type { import('eslint').ESLint.Plugin }
 */
module.exports = {
  rules: {
    // 'no-denied-layers': require('./rules/no-denied-layers'),
    'no-unknown-layers': require('./rules/no-unknown-layers'),
    // 'no-deprecated-layers': {},
    // sort: {},
  },
  //   configs: {},
};
