import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      // artifacts
      'build',
      'dist',
      'coverage',
      '.cache',

      // dependencies
      'node_modules',
      '.pnp',
      '.pnp.js',
      '.yarn',

      // debug
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      '.pnpm-debug.log*',

      // linting
      '.husky',
      '.eslintignore',
      '.prettierignore',
      '.eslintrc.*',

      // misc
      '.DS_Store',
      '*.pem',

      // code editors
      '.vscode/*',
      '!.vscode/extensions.json',
      '.idea',
      '*.suo',
      '*.ntvs*',
      '*.njsproj',
      '*.sln',
      '*.sw?',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        project: 'tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'array-callback-return': ['error', { checkForEach: true }],
      eqeqeq: 'error',
      'no-restricted-exports': [
        'error',
        { restrictDefaultExports: { direct: true, named: true } },
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
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
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
  },

  eslintConfigPrettier,
];
