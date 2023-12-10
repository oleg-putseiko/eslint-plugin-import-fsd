import { type Rule } from 'eslint';
import { type ImportDeclaration } from 'estree';

import { LAYERS, getLayerNames } from './layers';

type Segments = {
  layer: string | null;
  slice: string | null;
};

type FileData = Segments & {
  rootDir: string;
  fullPath: string;
  layerIndex: number;
};

type ImportData = Segments & {
  path: string;
  layerIndex: number;
};

const resolvePath = (dir: string, path: string) => {
  if (/^\//u.test(path)) return path;

  let resolvedPath = `${dir}/${path}`
    .replace(/\/\.?\/?$/u, '')
    .replaceAll(/(?<=(^|\/))\.\//gu, '');

  while (/(\.{2}\/|\/\.{2}$)/u.test(resolvedPath)) {
    resolvedPath = resolvedPath.replace(/(^|([^\\/]*\/))\.{2}(\/|$)/u, '');
  }

  return resolvedPath.replace(/\/+$/u, '');
};

const extractSegments = (fullPath: string, rootDir: string): Segments => {
  if (!fullPath.startsWith(rootDir)) {
    return { layer: null, slice: null };
  }

  const pathFromRoot = fullPath.substring(rootDir.length);
  const segments = [...pathFromRoot.matchAll(/[^\\/]+/gu)].map((matches) =>
    matches.at(0),
  );

  const layer = segments.at(0) || null;
  const slice =
    (segments.length > 2
      ? segments.at(1)
      : // Remove file extension
        segments.at(1)?.replace(/.+\.[^\\.]+$/u, '')) || null;

  return { layer, slice };
};

export const extractFileDataFromContext = (
  context: Rule.RuleContext,
): FileData | null => {
  const rootDir = context.settings.fsd?.rootDir ?? context.cwd;

  if (typeof rootDir !== 'string') return null;

  const fullPath = context.filename;
  const segments = extractSegments(fullPath, rootDir);

  const layerIndex = LAYERS.findIndex((item) =>
    segments.layer ? getLayerNames(item).includes(segments.layer) : false,
  );

  return { ...segments, rootDir, fullPath, layerIndex };
};

export const extractImportDataFromNode = (
  node: ImportDeclaration & Rule.NodeParentExtension,
  fileData: FileData,
): ImportData | null => {
  const path = node.source.value;

  if (typeof path !== 'string') return null;

  const nonAliasedPath = /^(@\/|src\/)(.+)/u.exec(path)?.at(2);
  let layer: string | null = null;
  let slice: string | null = null;

  if (nonAliasedPath) {
    const pathSegments = nonAliasedPath.split('/');

    if (pathSegments.length < 1) return null;

    layer = pathSegments.at(0) || null;
    slice =
      (pathSegments.length > 1
        ? pathSegments.at(1)
        : // Remove file extension
          pathSegments.at(1)?.replace(/.+\.[^\\.]+$/u, '')) || null;
  } else if (/^\.+/u.test(path)) {
    const fileDir =
      // Remove file name segment
      fileData.fullPath.replace(/\/[^\\/]*$/u, '');

    const resolvedPath = resolvePath(fileDir, path);
    const segments = extractSegments(resolvedPath, fileData.rootDir);

    layer = segments.layer;
    slice = segments.slice;
  }

  const layerIndex = LAYERS.findIndex((item) =>
    layer ? getLayerNames(item).includes(layer) : false,
  );

  return { path, layer, slice, layerIndex };
};
