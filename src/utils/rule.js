const { LAYERS, getLayerNames } = require('./layers');

/**
 * @typedef { {
 *      fullPath: string;
 *      rootPath: string;
 *      layer: string;
 *      slice: string;
 *      layerIndex: number;
 * } } FileData
 *
 * @param { import('eslint').Rule.RuleContext } context
 *
 * @returns { FileData | null } Extracted file data
 */
const extractFileDataFromContext = (context) => {
  const fullPath = context.filename;
  const rootDir = context.settings.fsd?.rootDir ?? context.cwd;

  if (typeof rootDir !== 'string' || !fullPath.startsWith(rootDir)) {
    return null;
  }

  const rootPath = fullPath.substring(rootDir.length);
  const rootPathSegments = [...rootPath.matchAll(/[^\\/\\.]+/gu)];

  if (rootPathSegments.length < 2) return;

  const layer = rootPathSegments[0].at(0);
  const slice = rootPathSegments[1].at(0);

  if (!layer || !slice) return;

  const layerIndex = LAYERS.findIndex((item) =>
    getLayerNames(item).includes(layer),
  );

  if (layerIndex < 0) return null;

  return { fullPath, rootPath, layer, slice, layerIndex };
};

/**
 * @typedef { {
 *      path: string;
 *      layer: string;
 *      slice: string;
 *      layerIndex: number;
 * } } ImportData
 *
 * @param {import('estree').ImportDeclaration & import('eslint').Rule.NodeParentExtension} node
 *
 * @returns { ImportData | null } Extracted import data
 */
const extractImportDataFromNode = (node) => {
  const path = node.source.value;

  if (typeof path !== 'string' || !path) return null;

  const layer = /^(@|@\/|src\/)([^\\/]+)/gu.exec(path)?.at(2);
  const slice = RegExp(`^(@|@\\/|src\\/)${layer}/([^\\/]+)/`).exec(path)?.at(2);

  if (!layer || !slice) return null;

  const layerIndex = LAYERS.findIndex((item) =>
    getLayerNames(item).includes(layer),
  );

  return { path, layer, slice, layerIndex };
};

module.exports = { extractFileDataFromContext, extractImportDataFromNode };
