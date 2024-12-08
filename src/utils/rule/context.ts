import { type Rule } from 'eslint';
import { type ImportDeclaration } from 'estree';
import * as path from 'node:path';

import { type Aliases, isAliases, resolveAliasedPath } from './aliases';
import { isString } from '../guards';
import { LAYERS } from '../layers';
import { isOverrides, type Overrides } from './overrides';
import { extractSegments, type Segments } from './segments';

type ShallowNullable<T> = T extends Record<infer K, unknown>
  ? { [X in K]: T[K] | null }
  : T | null;

type ImportNode = Pick<ImportDeclaration, 'source'>;

type RuleContext = Pick<Rule.RuleContext, 'cwd' | 'filename' | 'settings'>;

type PathContext = ShallowNullable<Segments> & {
  cwd: string;
  rootDir: string;
  fullPath: string;
  layerIndex: number;
  aliases: Aliases;
  overrides: Overrides;
};

type ImportContext = ShallowNullable<Segments> & {
  layerIndex: number;
};

const isPathRelativeOrAbsolute = (value: string) =>
  path.isAbsolute(value) || /^\.+\//iu.test(value);

export const extractPathContext = (
  ruleContext: RuleContext,
): PathContext | null => {
  const cwd = ruleContext.cwd;
  const rootDirSetting = ruleContext.settings.fsd?.rootDir;
  const rootDir = isString(rootDirSetting)
    ? path.resolve(cwd, rootDirSetting)
    : cwd;
  const aliases = ruleContext.settings.fsd?.aliases ?? {};
  const overrides = ruleContext.settings.fsd?.overrides ?? {};

  if (!isAliases(aliases) || !isOverrides(overrides)) return null;

  const fullPath = ruleContext.filename;
  const fullPathSegments = extractSegments(fullPath, { rootDir, overrides });

  const layerIndex = LAYERS.findIndex((item) =>
    fullPathSegments.layer
      ? item.names.includes(fullPathSegments.layer)
      : false,
  );
  const layerDetails = LAYERS[layerIndex];
  const hasSlices = layerDetails?.hasSlices ?? true;

  return {
    layer: fullPathSegments.layer,
    slice: hasSlices ? fullPathSegments.slice : null,
    cwd,
    rootDir,
    fullPath,
    layerIndex,
    aliases,
    overrides,
  };
};

export const extractImportContext = (
  node: ImportNode,
  pathContext: PathContext,
): ImportContext | null => {
  const importPath = node.source.value;
  const { cwd, aliases, fullPath } = pathContext;

  if (!isString(importPath)) return null;

  const resolvedAliasedPath = resolveAliasedPath(aliases, importPath);
  let resolvedPath = importPath;

  if (resolvedAliasedPath !== null) {
    resolvedPath = path.resolve(cwd, resolvedAliasedPath);
  } else if (isPathRelativeOrAbsolute(importPath)) {
    resolvedPath = path.resolve(path.dirname(fullPath), importPath);
  }

  const resolvedPathSegments = extractSegments(resolvedPath, pathContext);
  const layerIndex = LAYERS.findIndex((item) =>
    resolvedPathSegments.layer
      ? item.names.includes(resolvedPathSegments.layer)
      : false,
  );
  const layerDetails = LAYERS[layerIndex];
  const hasSlices = layerDetails?.hasSlices ?? true;

  return {
    layer: resolvedPathSegments.layer,
    slice: hasSlices ? resolvedPathSegments.slice : null,
    layerIndex,
  };
};
