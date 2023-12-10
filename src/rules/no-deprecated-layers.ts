import { type Rule } from 'eslint';

import { LAYERS } from '../utils/layers';
import {
  extractFileDataFromContext,
  extractImportDataFromNode,
} from '../utils/rule';
import { isStringArray } from '../utils/guards';

const MESSAGE =
  "Layer '{{ deprecated_layer }}' is deprecated, use '{{ recommended_layer }}' instead.";

const DEPRECATED_LAYER_NAMES = LAYERS.flatMap((item) => item.deprecatedNames);

export const noDeprecatedLayersRule: Rule.RuleModule = {
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

    if (fileData === null) return {};

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
            message: MESSAGE,
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
