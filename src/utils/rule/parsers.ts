import { type Rule } from 'eslint';
import { type ImportDeclaration } from 'estree';

import { isObject, isString } from '../guards';
import { LAYERS } from '../layers';
import { PATH_REGEXPS, resolvePath } from '../path';

type ShallowNullable<T> = T extends Record<infer K, unknown>
  ? { [X in K]: T[K] | null }
  : T | null;

type Segments = {
  layer: string;
  slice: string;
};

type SegmentsContext = {
  rootDir: string;
  packages: Packages;
};

type Aliases = { [alias: string]: string };
type Packages = { [packagePattern: string]: Segments };

type FileData = ShallowNullable<Segments> & {
  rootDir: string;
  fullPath: string;
  layerIndex: number;
  aliases: Aliases;
  packages: Packages;
};

type ImportData = ShallowNullable<Segments> & {
  path: string;
  layerIndex: number;
};

const isAliases = (value: unknown): value is Aliases =>
  isObject(value) &&
  Object.keys(value).every((key) => isString(key) && isString(value[key]));

const isPackages = (value: unknown): value is Packages =>
  isObject(value) &&
  Object.values(value).every(
    (entry) =>
      isObject(entry) && isString(entry.layer) && isString(entry.slice),
  );

const extractSegments = (
  fullPath: string,
  context: SegmentsContext,
): ShallowNullable<Segments> => {
  const { rootDir, packages } = context;

  const matchedPattern = Object.keys(packages).find((pattern) =>
    new RegExp(`^${pattern.replaceAll('*', '(.*)')}$`, 'gu').test(fullPath),
  );

  if (matchedPattern) {
    return packages[matchedPattern];
  }

  if (!fullPath.startsWith(rootDir)) {
    return { layer: null, slice: null };
  }

  const pathFromRoot = fullPath.substring(rootDir.length);
  const pathSegments = [...pathFromRoot.matchAll(PATH_REGEXPS.segments)].map(
    (matches) => matches.at(0),
  );

  const layer = pathSegments.at(0) || null;
  const slice =
    (pathSegments.length > 2
      ? pathSegments.at(1)
      : pathSegments.at(1)?.replace(PATH_REGEXPS.fileExtension, '$1')) || null;

  return { layer, slice };
};

export const extractFileDataFromContext = (
  context: Rule.RuleContext,
): FileData | null => {
  const rootDir = context.settings.fsd?.rootDir ?? context.cwd;
  const aliases = context.settings.fsd?.aliases ?? {};
  const packages = context.settings.fsd?.packages ?? {};

  if (!isString(rootDir) || !isAliases(aliases) || !isPackages(packages)) {
    return null;
  }

  const fullPath = context.filename;
  const segments = extractSegments(fullPath, { rootDir, packages });

  const layerIndex = LAYERS.findIndex((item) =>
    segments.layer ? item.names.includes(segments.layer) : false,
  );

  return { ...segments, rootDir, fullPath, layerIndex, aliases, packages };
};

export const extractImportDataFromNode = (
  node: ImportDeclaration & Rule.NodeParentExtension,
  fileData: FileData,
): ImportData | null => {
  const path = node.source.value;

  if (!isString(path)) return null;

  const fileDir = fileData.fullPath.replace(PATH_REGEXPS.fileName, '');
  const alias = Object.keys(fileData.aliases)
    .map((alias) => ({
      name: alias,
      replacement: RegExp(`^${alias.replace('*', '(.*)')}$`, 'u')
        .exec(path)
        ?.at(1),
    }))
    .find(({ replacement }) => replacement !== undefined);

  let resolvedPath = path;

  if (alias?.replacement !== undefined) {
    resolvedPath = resolvePath(
      fileData.rootDir,
      fileData.aliases[alias.name].replace('*', alias.replacement),
    );
  } else if (PATH_REGEXPS.relativeOrAbsoluteStart.test(path)) {
    resolvedPath = resolvePath(fileDir, path);
  }

  const segments = extractSegments(resolvedPath, fileData);
  const layerIndex = LAYERS.findIndex((item) =>
    segments.layer ? item.names.includes(segments.layer) : false,
  );

  return { ...segments, path, layerIndex };
};
