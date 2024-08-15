import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards';
import { LAYERS, listNames } from '../utils/layers';
import {
  extractPathContext,
  extractImportContext,
} from '../utils/rule/context';
import {
  Scope,
  isScope,
  isFileScope,
  isImportScope,
} from '../utils/rule/scope';
import { SCOPED_SCHEMA } from '../utils/rule/schema';

const DEPRECATED_LAYER_NAMES = LAYERS.flatMap((item) => item.deprecatedNames);

export const noDeprecatedLayersRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent import from a deprecated layer.',
      recommended: true,
      url: 'https://github.com/oleg-putseiko/eslint-plugin-import-fsd?tab=readme-ov-file#no-deprecated-layers',
    },
    schema: [SCOPED_SCHEMA],
    messages: {
      deprecatedFileLayer: "File layer '{{ deprecated_layer }}' is deprecated.",
      replaceableDeprecatedFileLayer:
        "File layer '{{ deprecated_layer }}' is deprecated, use {{ recommended_layers }} instead.",
      deprecatedImportLayer: "Layer '{{ deprecated_layer }}' is deprecated.",
      replaceableDeprecatedImportLayer:
        "Layer '{{ deprecated_layer }}' is deprecated, use {{ recommended_layers }} instead.",
    },
  },
  create(ruleContext) {
    const listener: Rule.RuleListener = {};

    const scope = ruleContext.options.at(0)?.scope ?? Scope.All;
    const ignoredLayers = ruleContext.options.at(0)?.ignores ?? [];

    if (!isScope(scope) || !isStringArray(ignoredLayers)) {
      return listener;
    }

    const pathContext = extractPathContext(ruleContext);

    if (!pathContext?.layer) return listener;

    if (
      isFileScope(scope) &&
      DEPRECATED_LAYER_NAMES.includes(pathContext.layer) &&
      !ignoredLayers.includes(pathContext.layer)
    ) {
      listener.Program = (node) => {
        if (!pathContext?.layer) return;

        const replacementLayer = LAYERS[pathContext.layerIndex];
        const isReplaceable = replacementLayer.displayedActualNames.length > 0;

        ruleContext.report({
          node,
          messageId: isReplaceable
            ? 'replaceableDeprecatedFileLayer'
            : 'deprecatedFileLayer',
          data: {
            deprecated_layer: pathContext.layer,
            recommended_layers: listNames(
              replacementLayer.displayedActualNames,
            ),
          },
        });
      };
    }

    if (isImportScope(scope)) {
      listener.ImportDeclaration = (node) => {
        const importContext = extractImportContext(node, pathContext);

        if (
          importContext?.layer &&
          importContext.layerIndex >= 0 &&
          !ignoredLayers.includes(importContext.layer) &&
          DEPRECATED_LAYER_NAMES.includes(importContext.layer)
        ) {
          const replacementLayer = LAYERS[importContext.layerIndex];
          const isReplaceable =
            replacementLayer.displayedActualNames.length > 0;

          ruleContext.report({
            node,
            messageId: isReplaceable
              ? 'replaceableDeprecatedImportLayer'
              : 'deprecatedImportLayer',
            data: {
              deprecated_layer: importContext.layer,
              recommended_layers: listNames(
                replacementLayer.displayedActualNames,
              ),
            },
          });
        }
      };
    }

    return listener;
  },
};
