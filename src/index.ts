import { type Rule, type ESLint } from 'eslint';

import { noDeniedLayersRule } from './rules/no-denied-layers';
import { noUnknownLayersRule } from './rules/no-unknown-layers';
import { noDeprecatedLayersRule } from './rules/no-deprecated-layers';

type Rules = Record<string, Rule.RuleModule>;
type Configs = Record<string, ESLint.ConfigData>;

export const rules: Rules = {
  'no-denied-layers': noDeniedLayersRule,
  'no-unknown-layers': noUnknownLayersRule,
  'no-deprecated-layers': noDeprecatedLayersRule,
};

export const configs: Configs = {
  recommended: {
    rules: {
      'import-fsd/no-denied-layers': 'error',
      'import-fsd/no-unknown-layers': 'error',
      'import-fsd/no-deprecated-layers': 'warn',
    },
  },
};
