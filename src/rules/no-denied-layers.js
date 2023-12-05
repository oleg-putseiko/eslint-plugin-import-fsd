const { LAYERS, getLayerNames } = require('../utils/layers');
const {
  extractImportDataFromNode,
  extractFileDataFromContext,
} = require('../utils/rule');

const MESSAGE = 'Access to this layer or slice from the current one is denied.';

/**
 * @type { import('eslint').Rule.RuleModule }
 */
module.exports = {
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
