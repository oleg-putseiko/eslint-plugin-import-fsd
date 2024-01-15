import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards';
import { LAYERS, listNames } from '../utils/layers';
import {
  Declaration,
  isDeclaration,
  isFileDeclaration,
  isImportDeclaration,
} from '../utils/rule/declarations';
import {
  extractFileDataFromContext,
  extractImportDataFromNode,
} from '../utils/rule/parsers';
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
  create(context) {
    const listener: Rule.RuleListener = {};

    const declaration = context.options.at(0)?.declaration ?? Declaration.All;
    const ignoredLayers = context.options.at(0)?.ignores ?? [];

    if (!isDeclaration(declaration) || !isStringArray(ignoredLayers)) {
      return listener;
    }

    const fileData = extractFileDataFromContext(context);

    if (!fileData?.layer) return listener;

    if (
      isFileDeclaration(declaration) &&
      DEPRECATED_LAYER_NAMES.includes(fileData.layer) &&
      !ignoredLayers.includes(fileData.layer)
    ) {
      listener.Program = (node) => {
        if (!fileData?.layer) return;

        const replacementLayer = LAYERS[fileData.layerIndex];
        const isReplaceable = replacementLayer.displayedActualNames.length > 0;

        context.report({
          node,
          message: isReplaceable
            ? REPLACEABLE_DEPRECATED_FILE_LAYER_MESSAGE
            : DEPRECATED_FILE_LAYER_MESSAGE,
          data: {
            deprecated_layer: fileData.layer,
            recommended_layers: listNames(
              replacementLayer.displayedActualNames,
            ),
          },
        });
      };
    }

    if (isImportDeclaration(declaration)) {
      listener.ImportDeclaration = (node) => {
        const importData = extractImportDataFromNode(node, fileData);

        if (
          importData?.layer &&
          importData.layerIndex >= 0 &&
          !ignoredLayers.includes(importData.layer) &&
          DEPRECATED_LAYER_NAMES.includes(importData.layer)
        ) {
          const replacementLayer = LAYERS[importData.layerIndex];
          const isReplaceable =
            replacementLayer.displayedActualNames.length > 0;

          context.report({
            node,
            message: isReplaceable
              ? REPLACEABLE_DEPRECATED_IMPORT_LAYER_MESSAGE
              : DEPRECATED_IMPORT_LAYER_MESSAGE,
            data: {
              deprecated_layer: importData.layer,
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
