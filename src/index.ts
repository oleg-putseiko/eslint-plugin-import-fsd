import { ESLint } from 'eslint';

import { noDeniedLayersRule } from './rules/no-denied-layers';
import { noUnknownLayersRule } from './rules/no-unknown-layers';

const plugin: ESLint.Plugin = {
  rules: {
    'no-denied-layers': noDeniedLayersRule,
    'no-unknown-layers': noUnknownLayersRule,
  },
};

export default plugin;
