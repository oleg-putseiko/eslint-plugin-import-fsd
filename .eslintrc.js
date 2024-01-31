/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  root: true,
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'array-callback-return': ['error', { checkForEach: true }],
    eqeqeq: 'error',
    'no-restricted-exports': [
      'error',
      {
        restrictDefaultExports: {
          direct: true,
          named: true,
        },
      },
    ],
    'no-console': 'warn',
    'no-duplicate-imports': ['error', { includeExports: true }],
    'max-classes-per-file': ['error', { ignoreExpressions: true }],
    'no-floating-decimal': 'warn',
    'prefer-template': 'warn',
    'no-nested-ternary': 'warn',
    'no-else-return': 'error',
    'one-var': ['warn', 'never'],
    'prefer-exponentiation-operator': 'warn',
    'require-unicode-regexp': 'warn',
    'no-undef': 'off',

    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/prefer-as-const': 'warn',
    '@typescript-eslint/prefer-includes': 'warn',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
  },
};
