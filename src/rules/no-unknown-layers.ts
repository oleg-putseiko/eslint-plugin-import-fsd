import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards';
import { LAYERS, getLayerNames } from '../utils/layers';
import {
  extractFileDataFromContext,
  extractImportDataFromNode,
} from '../utils/rule';
import {
  DECLARATIONS,
  Declaration,
  isDeclaration,
  isFileDeclaration,
  isImportDeclaration,
} from '../utils/declaration';

const UNKNOWN_FILE_LAYER_MESSAGE = "Unknown file layer '{{ layer }}'.";
const UNKNOWN_IMPORT_LAYER_MESSAGE = "Unknown layer '{{ layer }}'.";

const KNOWN_LAYER_NAMES = LAYERS.flatMap(getLayerNames);

export const noUnknownLayersRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent import from an unknown layer.',
      recommended: true,
      url: 'https://github.com/oleg-putseiko/eslint-plugin-import-fsd?tab=readme-ov-file#no-unknown-layers',
    },
    schema: [
      {
        type: 'object',
        properties: {
          declaration: {
            enum: DECLARATIONS,
          },
          ignores: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const declaration = context.options.at(0)?.declaration ?? Declaration.All;
    const ignoredLayers = context.options.at(0)?.ignores ?? [];

    if (!isDeclaration(declaration) || !isStringArray(ignoredLayers)) return {};

    const fileData = extractFileDataFromContext(context);

    if (!fileData?.layer) return {};

    if (
      isFileDeclaration(declaration) &&
      fileData.layerIndex < 0 &&
      !ignoredLayers.includes(fileData.layer)
    ) {
      return {
        Program(node) {
          if (!fileData?.layer) return;

          context.report({
            node,
            message: UNKNOWN_FILE_LAYER_MESSAGE,
            data: { layer: fileData.layer },
          });
        },
      };
    }

    if (!isImportDeclaration(declaration)) return {};

    return {
      ImportDeclaration(node) {
        const importData = extractImportDataFromNode(node, fileData);

        if (!importData?.layer) return;

        if (
          !ignoredLayers.includes(importData.layer) &&
          !KNOWN_LAYER_NAMES.includes(importData.layer)
        ) {
          context.report({
            node,
            message: UNKNOWN_IMPORT_LAYER_MESSAGE,
            data: { layer: importData.layer },
          });
        }
      },
    };
  },
};
