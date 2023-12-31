import { type ESLint } from 'eslint';

import { noDeniedLayersRule } from './rules/no-denied-layers';
import { noUnknownLayersRule } from './rules/no-unknown-layers';
import { noDeprecatedLayersRule } from './rules/no-deprecated-layers';

export const rules: ESLint.Plugin['rules'] = {
  'no-denied-layers': noDeniedLayersRule,
  'no-unknown-layers': noUnknownLayersRule,
  'no-deprecated-layers': noDeprecatedLayersRule,
};

export const configs: ESLint.Plugin['configs'] = {
  recommended: {
    rules: {
      'import-fsd/no-denied-layers': 'error',
      'import-fsd/no-unknown-layers': 'error',
      'import-fsd/no-deprecated-layers': 'warn',
    },
  },
};
