import { type ESLint } from 'eslint';

import { noDeniedLayersRule } from './rules/no-denied-layers';
import { noUnknownLayersRule } from './rules/no-unknown-layers';

export const rules: ESLint.Plugin['rules'] = {
  'no-denied-layers': noDeniedLayersRule,
  'no-unknown-layers': noUnknownLayersRule,
};
