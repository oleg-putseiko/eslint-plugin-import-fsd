import { Rule } from 'eslint';
import { ImportDeclaration } from 'estree';

import { LAYERS, getLayerNames } from './layers';

type FileData = {
  fullPath: string;
  rootPath: string;
  layer: string;
  slice: string;
  layerIndex: number;
};

type ImportData = {
  path: string;
  layer: string;
  slice: string;
  layerIndex: number;
};

export const extractFileDataFromContext = (
  context: Rule.RuleContext,
): FileData | null => {
  const fullPath = context.filename;
  const rootDir = context.settings.fsd?.rootDir ?? context.cwd;

  if (typeof rootDir !== 'string' || !fullPath.startsWith(rootDir)) {
    return null;
  }

  const rootPath = fullPath.substring(rootDir.length);
  const rootPathSegments = [...rootPath.matchAll(/[^\\/\\.]+/gu)];

  if (rootPathSegments.length < 2) return null;

  const layer = rootPathSegments[0].at(0);
  const slice = rootPathSegments[1].at(0);

  if (!layer || !slice) return null;

  const layerIndex = LAYERS.findIndex((item) =>
    getLayerNames(item).includes(layer),
  );

  if (layerIndex < 0) return null;

  return { fullPath, rootPath, layer, slice, layerIndex };
};

export const extractImportDataFromNode = (
  node: ImportDeclaration & Rule.NodeParentExtension,
): ImportData | null => {
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
