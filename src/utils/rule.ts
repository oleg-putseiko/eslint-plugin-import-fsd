import { type Rule } from 'eslint';
import { type ImportDeclaration } from 'estree';

import { LAYERS, getLayerNames } from './layers';
import { isObject, isString } from './guards';

export enum Declaration {
  Import = 'import',
  File = 'file',
  All = 'all',
}

type Aliases = Record<string, string>;

type Segments = {
  layer: string | null;
  slice: string | null;
};

type FileData = Segments & {
  rootDir: string;
  fullPath: string;
  layerIndex: number;
  aliases: Aliases;
};

type ImportData = Segments & {
  path: string;
  layerIndex: number;
};

export const DECLARATIONS: string[] = [
  Declaration.Import,
  Declaration.File,
  Declaration.All,
];

export const isDeclaration = (value: unknown): value is Declaration =>
  isString(value) && DECLARATIONS.includes(value);

export const isFileDeclaration = (value: Declaration) =>
  [Declaration.File, Declaration.All].includes(value);

export const isImportDeclaration = (value: Declaration) =>
  [Declaration.Import, Declaration.All].includes(value);

const isAliases = (value: unknown): value is Aliases =>
  isObject(value) &&
  Object.keys(value).every((key) => isString(key) && isString(value[key]));

const resolvePath = (dir: string, path: string) => {
  if (!/^\.*\//u.test(path)) return path;

  let resolvedPath = (/^\.+\//u.test(path) ? `${dir}/${path}` : path)
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
  const aliases = context.settings.fsd?.aliases ?? {};

  if (!isString(rootDir) || !isAliases(aliases)) return null;

  const fullPath = context.filename;
  const segments = extractSegments(fullPath, rootDir);

  const layerIndex = LAYERS.findIndex((item) =>
    segments.layer ? getLayerNames(item).includes(segments.layer) : false,
  );

  return { ...segments, rootDir, fullPath, layerIndex, aliases };
};

export const extractImportDataFromNode = (
  node: ImportDeclaration & Rule.NodeParentExtension,
  fileData: FileData,
): ImportData | null => {
  const path = node.source.value;

  if (!isString(path)) return null;

  const fileDir =
    // Remove file name segment
    fileData.fullPath.replace(/\/[^\\/]*$/u, '');
  const alias = Object.keys(fileData.aliases)
    .map((alias) => ({
      name: alias,
      replacement: RegExp(`^${alias.replace('*', '(.*)')}$`, 'u')
        .exec(path)
        ?.at(1),
    }))
    .find(({ replacement }) => replacement !== undefined);

  let resolvedPath = path;

  // Aliased import path
  if (alias?.replacement !== undefined) {
    resolvedPath = resolvePath(
      fileData.rootDir,
      fileData.aliases[alias.name].replace('*', alias.replacement),
    );
  }
  // Relative or absolute import path
  else if (/^\.*\//u.test(path)) {
    resolvedPath = resolvePath(fileDir, path);
  }

  const segments = extractSegments(resolvedPath, fileData.rootDir);
  const layerIndex = LAYERS.findIndex((item) =>
    segments.layer ? getLayerNames(item).includes(segments.layer) : false,
  );

  return { ...segments, path, layerIndex };
};
