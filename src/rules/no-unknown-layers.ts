import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards';
import { LAYERS, getLayerNames } from '../utils/layers';
import {
  extractFileDataFromContext,
  extractImportDataFromNode,
} from '../utils/rule';

const UNKNOWN_FILE_LAYER_MESSAGE = "Unknown file layer '{{ layer }}'.";
const UNKNOWN_IMPORT_LAYER_MESSAGE = "Unknown layer '{{ layer }}'.";

const KNOWN_LAYER_NAMES = LAYERS.flatMap(getLayerNames);

export const noUnknownLayersRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Prevent import from an unknown layer',
      recommended: true,
      url: '',
    },
    schema: [
      {
        type: 'object',
        properties: {
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
    const ignoredLayers = context.options.at(0)?.ignores ?? [];

    if (!isStringArray(ignoredLayers)) return {};

    const fileData = extractFileDataFromContext(context);

    if (!fileData?.layer) return {};

    if (fileData.layerIndex < 0 && !ignoredLayers.includes(fileData.layer)) {
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
