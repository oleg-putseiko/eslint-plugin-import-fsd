import { type Rule } from 'eslint';

import { LAYERS, getLayerNames } from '../utils/layers';
import { extractImportDataFromNode } from '../utils/rule';

const MESSAGE = "Unknown layer '{{ layer }}'";

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
          exclude: {
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
    const excludedLayers = context.options.at(0)?.exclude ?? [];

    return {
      ImportDeclaration(node) {
        const importData = extractImportDataFromNode(node);

        if (importData === null) return;

        if (
          !excludedLayers.includes(importData.layer) &&
          !KNOWN_LAYER_NAMES.includes(importData.layer)
        ) {
          context.report({
            node,
            message: MESSAGE,
            data: { layer: importData.layer },
          });
        }
      },
    };
  },
};
