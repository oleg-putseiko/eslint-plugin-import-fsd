import { type Rule } from 'eslint';
import { type ImportDeclaration } from 'estree';

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
  const rootPathSegments = [...rootPath.matchAll(/[^\\/]+/gu)];

  if (rootPathSegments.length < 2) return null;

  const layer = rootPathSegments[0].at(0);
  const slice =
    rootPathSegments.length > 2
      ? rootPathSegments[1].at(0)
      : rootPathSegments[1].at(0)?.replace(/.+\.[^\\.]+$/u, '');

  if (!layer || !slice) return null;

  const layerIndex = LAYERS.findIndex((item) =>
    getLayerNames(item).includes(layer),
  );

  return { fullPath, rootPath, layer, slice, layerIndex };
};

export const extractImportDataFromNode = (
  node: ImportDeclaration & Rule.NodeParentExtension,
): ImportData | null => {
  const path = node.source.value;

  if (typeof path !== 'string') return null;

  const nonAliasedPath = /^(@\/|src\/)(.+)/u.exec(path)?.at(2);

  if (!nonAliasedPath) return null;

  const pathSegments = nonAliasedPath.split('/');

  if (pathSegments.length < 2) return null;

  const layer = pathSegments[0];
  const slice =
    pathSegments.length > 2
      ? pathSegments[1]
      : pathSegments[1].replace(/.+\.[^\\.]+$/u, '');

  if (!layer || !slice) return null;

  const layerIndex = LAYERS.findIndex((item) =>
    getLayerNames(item).includes(layer),
  );

  return { path, layer, slice, layerIndex };
};
