import { type Rule, type ESLint } from 'eslint';

import { noDeniedLayersRule } from './rules/no-denied-layers';
import { noUnknownLayersRule } from './rules/no-unknown-layers';
import { noDeprecatedLayersRule } from './rules/no-deprecated-layers';

type Rules = Record<
  'no-denied-layers' | 'no-unknown-layers' | 'no-deprecated-layers',
  Rule.RuleModule
>;

type Configs = {
  recommended: ESLint.ConfigData;
};

type Plugin = {
  rules: Rules;
  configs: Configs;
};

const plugin: Plugin = {
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

// eslint-disable-next-line no-restricted-exports
export default plugin;
