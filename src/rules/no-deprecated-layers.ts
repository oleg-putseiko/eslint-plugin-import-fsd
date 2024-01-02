import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards';
import { LAYERS } from '../utils/layers';
import {
  DECLARED_SCHEMA,
  Declaration,
  extractFileDataFromContext,
  extractImportDataFromNode,
  isDeclaration,
  isFileDeclaration,
  isImportDeclaration,
} from '../utils/rule';

const DEPRECATED_FILE_LAYER_MESSAGE =
  "File layer '{{ deprecated_layer }}' is deprecated, use '{{ recommended_layer }}' instead.";
const DEPRECATED_IMPORT_LAYER_MESSAGE =
  "Layer '{{ deprecated_layer }}' is deprecated, use '{{ recommended_layer }}' instead.";

const DEPRECATED_LAYER_NAMES = LAYERS.flatMap((item) => item.deprecatedNames);

export const noDeprecatedLayersRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent import from a deprecated layer.',
      recommended: true,
      url: 'https://github.com/oleg-putseiko/eslint-plugin-import-fsd?tab=readme-ov-file#no-deprecated-layers',
    },
    schema: DECLARED_SCHEMA,
  },
  create(context) {
    const declaration = context.options.at(0)?.declaration ?? Declaration.All;
    const ignoredLayers = context.options.at(0)?.ignores ?? [];

    if (!isDeclaration(declaration) || !isStringArray(ignoredLayers)) return {};

    const fileData = extractFileDataFromContext(context);

    if (!fileData?.layer) return {};

    if (
      isFileDeclaration(declaration) &&
      DEPRECATED_LAYER_NAMES.includes(fileData.layer) &&
      !ignoredLayers.includes(fileData.layer)
    ) {
      return {
        Program(node) {
          if (!fileData?.layer) return;

          context.report({
            node,
            message: DEPRECATED_FILE_LAYER_MESSAGE,
            data: {
              deprecated_layer: fileData.layer,
              recommended_layer: LAYERS[fileData.layerIndex].name,
            },
          });
        },
      };
    }

    if (!isImportDeclaration(declaration)) return {};

    return {
      ImportDeclaration(node) {
        const importData = extractImportDataFromNode(node, fileData);

        if (!importData?.layer || importData.layerIndex < 0) return;

        if (
          !ignoredLayers.includes(importData.layer) &&
          DEPRECATED_LAYER_NAMES.includes(importData.layer)
        ) {
          context.report({
            node,
            message: DEPRECATED_IMPORT_LAYER_MESSAGE,
            data: {
              deprecated_layer: importData.layer,
              recommended_layer: LAYERS[importData.layerIndex].name,
            },
          });
        }
      },
    };
  },
};
