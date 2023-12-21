import { type Rule } from 'eslint';
import { type ImportDeclaration } from 'estree';

import { LAYERS, getLayerNames } from './layers';
import { isObject, isString } from './guards';
import { PATH_REGEXPS, resolvePath } from './path';

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

const isAliases = (value: unknown): value is Aliases =>
  isObject(value) &&
  Object.keys(value).every((key) => isString(key) && isString(value[key]));

const parseSegments = (segments: (string | undefined)[]): Segments => {
  const layer = segments.at(0) || null;
  const slice =
    (segments.length > 2
      ? segments.at(1)
      : segments.at(1)?.replace(PATH_REGEXPS.fileExtension, '')) || null;

  return { layer, slice };
};

const extractSegments = (fullPath: string, rootDir: string): Segments => {
  if (!fullPath.startsWith(rootDir)) {
    return { layer: null, slice: null };
  }

  const pathFromRoot = fullPath.substring(rootDir.length);
  const segments = [...pathFromRoot.matchAll(PATH_REGEXPS.segments)].map(
    (matches) => matches.at(0),
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
  } else if (PATH_REGEXPS.relativeOrAbsolute.test(path)) {
    resolvedPath = resolvePath(fileDir, path);
  }

  const segments = extractSegments(resolvedPath, fileData.rootDir);
  const layerIndex = LAYERS.findIndex((item) =>
    segments.layer ? getLayerNames(item).includes(segments.layer) : false,
  );

  return { ...segments, path, layerIndex };
};
