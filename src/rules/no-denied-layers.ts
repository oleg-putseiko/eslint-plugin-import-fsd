import { type Rule } from 'eslint';

import { LAYERS, getLayerNames } from '../utils/layers';
import {
  extractImportDataFromNode,
  extractFileDataFromContext,
} from '../utils/rule';

const DENIED_LAYER_MESSAGE =
  "Access to layer '{{ denied_layer }}' from '{{ file_layer }}' is denied.";
const DENIED_SLICE_MESSAGE =
  "Access to slice '{{ denied_slice }}' from '{{ file_slice }}' is denied.";

export const noDeniedLayersRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: '',
      recommended: true,
      url: '',
    },
    schema: [],
  },
  create(context) {
    const fileData = extractFileDataFromContext(context);

    if (fileData === null || fileData.layerIndex < 0) return {};

    const deniedLayers = LAYERS.slice(0, fileData.layerIndex + 1).flatMap(
      getLayerNames,
    );

    return {
      ImportDeclaration(node) {
        const importData = extractImportDataFromNode(node);

        if (importData === null) return;

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
        } else {
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
