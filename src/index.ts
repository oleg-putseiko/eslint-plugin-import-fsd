import { type Rule, type ESLint, type Linter } from 'eslint';

import { noDeniedLayersRule } from './rules/no-denied-layers.js';
import { noUnknownLayersRule } from './rules/no-unknown-layers.js';
import { noDeprecatedLayersRule } from './rules/no-deprecated-layers.js';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

type Rules = Record<
  'no-denied-layers' | 'no-unknown-layers' | 'no-deprecated-layers',
  Rule.RuleModule
>;

type Configs = {
  recommended: Linter.Config;
};

type Plugin = {
  meta: ESLint.ObjectMetaProperties['meta'];
  rules: Rules;
  configs: Configs;
};

const plugin: Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    'no-denied-layers': noDeniedLayersRule,
    'no-unknown-layers': noUnknownLayersRule,
    'no-deprecated-layers': noDeprecatedLayersRule,
  },
  configs: {
    recommended: {
      rules: {
        'import-fsd/no-denied-layers': 'error',
        'import-fsd/no-unknown-layers': 'error',
        'import-fsd/no-deprecated-layers': 'warn',
      },
    },
  },
} satisfies ESLint.Plugin;

Object.assign(plugin.configs.recommended, {
  ...plugin.configs.recommended,
  plugins: { 'import-fsd': plugin },
});

export default plugin;
