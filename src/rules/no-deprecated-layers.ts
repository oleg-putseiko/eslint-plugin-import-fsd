import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards.js';
import { LAYERS, joinNames } from '../utils/layers.js';
import { extractFileContext, extractImportContext } from '../utils/rule/context.js';
import { Scope, isScope, isFileScope, isImportScope } from '../utils/rule/scope.js';
import { SCOPED_SCHEMA } from '../utils/rule/schema.js';

const DEPRECATED_LAYER_NAMES = LAYERS.flatMap((item) => item.deprecatedNames);

const extractScope = (context: Rule.RuleContext): Scope => {
  const scope = context.options.at(0)?.scope ?? Scope.All;

  return isScope(scope) ? scope : Scope.All;
};

const extractIgnores = (context: Rule.RuleContext): string[] => {
  const ignores = context.options.at(0)?.ignores ?? [];

  return isStringArray(ignores) ? ignores : [];
};

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
      deprecatedFileLayer: "File layer '{{ deprecatedLayer }}' is deprecated.",
      replaceableDeprecatedFileLayer:
        "File layer '{{ deprecatedLayer }}' is deprecated, use {{ recommendedLayers }} instead.",

      deprecatedImportLayer: "Layer '{{ deprecatedLayer }}' is deprecated.",
      replaceableDeprecatedImportLayer:
        "Layer '{{ deprecatedLayer }}' is deprecated, use {{ recommendedLayers }} instead.",
    },
  },
  create(context) {
    const listener: Rule.RuleListener = {};

    const fileCtx = extractFileContext(context);

    const scope = extractScope(context);
    const ignores = extractIgnores(context);

    if (!fileCtx?.layer || fileCtx.layerIndex < 0) return listener;

    if (isFileScope(scope)) {
      const isIgnored = ignores.includes(fileCtx.layer);
      const isDeprecated = DEPRECATED_LAYER_NAMES.includes(fileCtx.layer);

      if (isDeprecated && !isIgnored) {
        listener.Program = () => {
          const layer = LAYERS[fileCtx.layerIndex];
          const isReplaceable = layer.displayedActualNames.length > 0;

          context.report({
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            },
            messageId: isReplaceable ? 'replaceableDeprecatedFileLayer' : 'deprecatedFileLayer',
            data: {
              deprecatedLayer: fileCtx.layer,
              recommendedLayers: joinNames(layer.displayedActualNames),
            },
          });
        };
      }
    }

    if (isImportScope(scope)) {
      listener.ImportDeclaration = (node) => {
        const importCtx = extractImportContext(node, fileCtx);

        if (!importCtx?.layer || importCtx.layerIndex < 0) return;

        const isIgnored = ignores.includes(importCtx.layer);
        const isDeprecated = DEPRECATED_LAYER_NAMES.includes(importCtx.layer);

        if (isDeprecated && !isIgnored) {
          const layer = LAYERS[importCtx.layerIndex];
          const isReplaceable = layer.displayedActualNames.length > 0;

          context.report({
            node,
            messageId: isReplaceable ? 'replaceableDeprecatedImportLayer' : 'deprecatedImportLayer',
            data: {
              deprecatedLayer: importCtx.layer,
              recommendedLayers: joinNames(layer.displayedActualNames),
            },
          });
        }
      };
    }

    return listener;
  },
};
