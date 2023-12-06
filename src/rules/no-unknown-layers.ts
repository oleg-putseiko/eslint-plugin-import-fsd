import { type Rule } from 'eslint';

import { LAYERS, getLayerNames } from '../utils/layers';
import {
  extractFileDataFromContext,
  extractImportDataFromNode,
} from '../utils/rule';
import { isStringArray } from '../utils/guards';

const UNKNOWN_FILE_LAYER_MESSAGE = "Unknown file layer '{{ layer }}'.";
const UNKNOWN_IMPORT_LAYER_MESSAGE = "Unknown layer '{{ layer }}'.";

const KNOWN_LAYER_NAMES = LAYERS.flatMap(getLayerNames);

export const noUnknownLayersRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: '',
      recommended: true,
      url: '',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
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
    const ignoredLayers = context.options.at(0)?.ignore ?? [];

    if (!isStringArray(ignoredLayers)) return {};

    const fileData = extractFileDataFromContext(context);

    if (fileData === null) {
      return {};
    } else if (
      fileData.layerIndex < 0 &&
      !ignoredLayers.includes(fileData.layer)
    ) {
      return {
        Program(node) {
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
        const importData = extractImportDataFromNode(node);

        if (importData === null) return;

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
