import { type Rule, type ESLint, type Linter } from 'eslint';

import { noDeniedLayersRule } from './rules/no-denied-layers';
import { noUnknownLayersRule } from './rules/no-unknown-layers';
import { noDeprecatedLayersRule } from './rules/no-deprecated-layers';

type Rules = Record<
  'no-denied-layers' | 'no-unknown-layers' | 'no-deprecated-layers',
  Rule.RuleModule
>;

type Configs = {
  recommended: Linter.FlatConfig;
  'recommended-legacy': ESLint.ConfigData;
};

type Plugin = {
  meta: ESLint.ObjectMetaProperties['meta'];
  rules: Rules;
  configs: Configs;
};

const plugin: Plugin = {
  meta: {
    name: 'eslint-plugin-import-fsd',
    version: '2.0.0-canary.1',
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
    'recommended-legacy': {
      plugins: ['import-fsd'],
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
  plugins: {
    'import-fsd': plugin,
  },
});

export = plugin;
