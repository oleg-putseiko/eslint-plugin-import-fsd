import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards';
import { LAYERS, listNames } from '../utils/layers';
import {
  extractPathContext,
  extractImportContext,
} from '../utils/rule/context';
import {
  Declaration,
  isDeclaration,
  isFileDeclaration,
  isImportDeclaration,
} from '../utils/rule/declarations';
import { DECLARED_SCHEMA } from '../utils/rule/schema';

const DEPRECATED_FILE_LAYER_MESSAGE =
  "File layer '{{ deprecated_layer }}' is deprecated.";
const REPLACEABLE_DEPRECATED_FILE_LAYER_MESSAGE =
  "File layer '{{ deprecated_layer }}' is deprecated, use {{ recommended_layers }} instead.";

const DEPRECATED_IMPORT_LAYER_MESSAGE =
  "Layer '{{ deprecated_layer }}' is deprecated.";
const REPLACEABLE_DEPRECATED_IMPORT_LAYER_MESSAGE =
  "Layer '{{ deprecated_layer }}' is deprecated, use {{ recommended_layers }} instead.";

const DEPRECATED_LAYER_NAMES = LAYERS.flatMap((item) => item.deprecatedNames);

export const noDeprecatedLayersRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent import from a deprecated layer.',
      recommended: true,
      url: 'https://github.com/oleg-putseiko/eslint-plugin-import-fsd?tab=readme-ov-file#no-deprecated-layers',
    },
    schema: [DECLARED_SCHEMA],
  },
  create(ruleContext) {
    const listener: Rule.RuleListener = {};

    const declaration =
      ruleContext.options.at(0)?.declaration ?? Declaration.All;
    const ignoredLayers = ruleContext.options.at(0)?.ignores ?? [];

    if (!isDeclaration(declaration) || !isStringArray(ignoredLayers)) {
      return listener;
    }

    const pathContext = extractPathContext(ruleContext);

    if (!pathContext?.layer) return listener;

    if (
      isFileDeclaration(declaration) &&
      DEPRECATED_LAYER_NAMES.includes(pathContext.layer) &&
      !ignoredLayers.includes(pathContext.layer)
    ) {
      listener.Program = (node) => {
        if (!pathContext?.layer) return;

        const replacementLayer = LAYERS[pathContext.layerIndex];
        const isReplaceable = replacementLayer.displayedActualNames.length > 0;

        ruleContext.report({
          node,
          message: isReplaceable
            ? REPLACEABLE_DEPRECATED_FILE_LAYER_MESSAGE
            : DEPRECATED_FILE_LAYER_MESSAGE,
          data: {
            deprecated_layer: pathContext.layer,
            recommended_layers: listNames(
              replacementLayer.displayedActualNames,
            ),
          },
        });
      };
    }

    if (isImportDeclaration(declaration)) {
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
            message: isReplaceable
              ? REPLACEABLE_DEPRECATED_IMPORT_LAYER_MESSAGE
              : DEPRECATED_IMPORT_LAYER_MESSAGE,
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
