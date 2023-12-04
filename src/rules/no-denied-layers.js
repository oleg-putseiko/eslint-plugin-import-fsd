const { LAYERS } = require('../constants/layers');

/**
 * @param { Layer } layer
 *
 * @returns { NamePattern[] } Layer name patterns
 */
const getLayerNames = (layer) =>
  layer.actualNames.concat(layer.deprecatedNames);

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
    const fileFullPath = context.filename;
    const rootDir = context.settings.fsd?.rootDir ?? context.cwd;

    if (typeof rootDir !== 'string' || !fileFullPath.startsWith(rootDir)) {
      return;
    }

    const fileRootPath = fileFullPath.substring(rootDir.length);
    const filePathSegments = [...fileRootPath.matchAll(/[^\\/\\.]+/gu)];

    if (filePathSegments.length < 2) return;

    const fileLayer = filePathSegments[0].at(0);
    const fileSlice = filePathSegments[1].at(0);

    if (!fileLayer || !fileSlice) return;

    const fileLayerIndex = LAYERS.findIndex((layer) =>
      getLayerNames(layer).includes(fileLayer),
    );

    if (fileLayerIndex < 0) return;

    const deniedLayers = LAYERS.slice(0, fileLayerIndex + 1).flatMap(
      getLayerNames,
    );

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (typeof importPath !== 'string' || !importPath) return;

        const importLayer = /^(@|@\/|src\/)?([^\\/]+)/gu
          .exec(importPath)
          ?.at(2);

        if (!importLayer) return;

        if (deniedLayers.includes(importLayer)) {
          const importSlice = RegExp(
            `^(@|@\\/|src\\/)?${importLayer}/([^\\/]+)/`,
          )
            .exec(importPath)
            ?.at(2);

          if (fileSlice !== importSlice) {
            context.report({
              node,
              message:
                'Access to this layer or slice from the current one is denied.',
            });
          }
        }
      },
    };
  },
};
