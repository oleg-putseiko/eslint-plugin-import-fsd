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
    // Remove '/./', '/.' and '/' from the end
    .replace(/\/\.?\/?$/u, '')
    // Remove './'
    .replaceAll(/(?<=(^|\/))\.\//gu, '');

  while (/(^|([^\\/]*\/))\.{2}(\/|$)/u.test(resolvedPath)) {
    // Remove 'foo/../'
    resolvedPath = resolvedPath.replace(/(^|([^\\/]*\/))\.{2}(\/|$)/u, '');
  }

  return resolvedPath.replace(/\/+$/u, '');
};

const parseSegments = (segments: (string | undefined)[]): Segments => {
  const layer = segments.at(0) || null;
  const slice =
    (segments.length > 2
      ? segments.at(1)
      : // Remove file extension
        segments.at(1)?.replace(/.+\.[^\\.]+$/u, '')) || null;

  return { layer, slice };
};

const extractSegments = (fullPath: string, rootDir: string): Segments => {
  if (!fullPath.startsWith(rootDir)) {
    return { layer: null, slice: null };
  }

  const pathFromRoot = fullPath.substring(rootDir.length);
  const segments = [...pathFromRoot.matchAll(/[^\\/]+/gu)].map((matches) =>
    matches.at(0),
  );

  return parseSegments(segments);
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
  let segments: Segments = { layer: null, slice: null };

  // Aliased import path
  if (nonAliasedPath) {
    segments = parseSegments(nonAliasedPath.split('/'));
  }
  // Relative or absolute import path
  else if (/^\.+/u.test(path)) {
    const fileDir =
      // Remove file name segment
      fileData.fullPath.replace(/\/[^\\/]*$/u, '');
    const resolvedPath = resolvePath(fileDir, path);

    segments = extractSegments(resolvedPath, fileData.rootDir);
  }

  const layerIndex = LAYERS.findIndex((item) =>
    segments.layer ? getLayerNames(item).includes(segments.layer) : false,
  );

  return { ...segments, path, layerIndex };
};
