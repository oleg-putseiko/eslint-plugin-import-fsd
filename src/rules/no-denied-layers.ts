import { type Rule } from 'eslint';

import { isStringArray } from '../utils/guards';
import { LAYERS, getLayerNames } from '../utils/layers';
import {
  extractImportDataFromNode,
  extractFileDataFromContext,
  BASE_SCHEMA,
} from '../utils/rule';

const DENIED_LAYER_MESSAGE =
  "Access to layer '{{ denied_layer }}' from '{{ file_layer }}' is denied.";
const DENIED_SLICE_MESSAGE =
  "Access to slice '{{ denied_slice }}' from '{{ file_slice }}' is denied.";

export const noDeniedLayersRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent import from a denied layer for a current one.',
      recommended: true,
      url: 'https://github.com/oleg-putseiko/eslint-plugin-import-fsd?tab=readme-ov-file#no-denied-layers',
    },
    schema: BASE_SCHEMA,
  },
  create(context) {
    const ignoredLayers = context.options.at(0)?.ignores ?? [];

    if (!isStringArray(ignoredLayers)) return {};

    const fileData = extractFileDataFromContext(context);

    if (fileData === null || fileData.layerIndex < 0) return {};

    const deniedLayers = LAYERS.slice(0, fileData.layerIndex + 1).flatMap(
      getLayerNames,
    );

    return {
      ImportDeclaration(node) {
        const importData = extractImportDataFromNode(node, fileData);

        if (
          !fileData.layer ||
          !importData?.layer ||
          ignoredLayers.includes(importData.layer)
        ) {
          return;
        }

        const areSlicesSame =
          fileData.layer === importData.layer &&
          fileData.slice === importData.slice;

        if (areSlicesSame || !deniedLayers.includes(importData.layer)) return;

        if (fileData.layer !== importData.layer) {
          context.report({
            node,
            message: DENIED_LAYER_MESSAGE,
            data: {
              denied_layer: importData.layer,
              file_layer: fileData.layer,
            },
          });
        } else if (importData.slice && fileData.slice) {
          context.report({
            node,
            message: DENIED_SLICE_MESSAGE,
            data: {
              denied_slice: importData.slice,
              file_slice: fileData.slice,
            },
          });
        }
      },
    };
  },
};
