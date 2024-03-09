import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards';
import { LAYERS } from '../utils/layers';
import {
  extractPathContext,
  extractImportContext,
} from '../utils/rule/context';
import { BASE_SCHEMA } from '../utils/rule/schema';

export const noDeniedLayersRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent import from a denied layer for a current one.',
      recommended: true,
      url: 'https://github.com/oleg-putseiko/eslint-plugin-import-fsd?tab=readme-ov-file#no-denied-layers',
    },
    schema: [BASE_SCHEMA],
    messages: {
      deniedLayer:
        "Access to layer '{{ denied_layer }}' from '{{ file_layer }}' is denied.",
      deniedSlice:
        "Access to slice '{{ denied_slice }}' from '{{ file_slice }}' is denied.",
    },
  },
  create(ruleContext) {
    const ignoredLayers = ruleContext.options.at(0)?.ignores ?? [];

    if (!isStringArray(ignoredLayers)) return {};

    const pathContext = extractPathContext(ruleContext);

    if (pathContext === null || pathContext.layerIndex < 0) return {};

    const deniedLayers = LAYERS.slice(0, pathContext.layerIndex + 1).flatMap(
      (item) => item.names,
    );

    return {
      ImportDeclaration(node) {
        const importContext = extractImportContext(node, pathContext);

        if (
          !pathContext.layer ||
          !importContext?.layer ||
          ignoredLayers.includes(importContext.layer)
        ) {
          return;
        }

        const areSlicesExist = importContext.slice && pathContext.slice;
        const areSlicesSame =
          pathContext.layer === importContext.layer &&
          pathContext.slice === importContext.slice;

        if (areSlicesSame || !deniedLayers.includes(importContext.layer))
          return;

        if (pathContext.layer !== importContext.layer || !areSlicesExist) {
          ruleContext.report({
            node,
            messageId: 'deniedLayer',
            data: {
              denied_layer: importContext.layer,
              file_layer: pathContext.layer,
            },
          });
        } else if (importContext.slice && pathContext.slice) {
          ruleContext.report({
            node,
            messageId: 'deniedSlice',
            data: {
              denied_slice: importContext.slice,
              file_slice: pathContext.slice,
            },
          });
        }
      },
    };
  },
};
