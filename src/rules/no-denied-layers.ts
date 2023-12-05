import { Rule } from 'eslint';

import { LAYERS, getLayerNames } from '../utils/layers';
import {
  extractImportDataFromNode,
  extractFileDataFromContext,
} from '../utils/rule';

const MESSAGE = 'Access to this layer or slice from the current one is denied.';

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
    console.log('file', context.filename);

    const fileData = extractFileDataFromContext(context);

    if (fileData === null || fileData.layerIndex < 0) return {};

    const deniedLayers = LAYERS.slice(0, fileData.layerIndex + 1).flatMap(
      getLayerNames,
    );

    return {
      ImportDeclaration(node) {
        const importData = extractImportDataFromNode(node);

        if (
          importData !== null &&
          deniedLayers.includes(importData.layer) &&
          fileData.slice !== importData.slice
        ) {
          context.report({ node, message: MESSAGE });
        }
      },
    };
  },
};
