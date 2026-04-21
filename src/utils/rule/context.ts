import { type Rule } from 'eslint';
import { type ImportDeclaration } from 'estree';
import * as path from 'node:path';

import { type Aliases, isAliases, resolveAliasedPath } from './aliases.js';
import { hasProperty, isString } from '../guards.js';
import { LAYERS } from '../layers.js';
import { isOverrides, type Overrides } from './overrides.js';
import { extractSegments, type Segments } from './segments.js';

type ShallowNullable<T> = T extends Record<infer K, unknown> ? { [X in K]: T[K] | null } : T | null;

type ImportNode = Pick<ImportDeclaration, 'source'>;

type RuleContext = Pick<Rule.RuleContext, 'cwd' | 'filename' | 'settings'>;

type FileContext = ShallowNullable<Segments> & {
  cwd: string;
  rootDir: string;
  path: string;
  layerIndex: number;
  aliases: Aliases;
  overrides: Overrides;
};

type ImportContext = ShallowNullable<Segments> & {
  layerIndex: number;
};

const isPathRelativeOrAbsolute = (value: string) =>
  path.isAbsolute(value) || /^\.+\//iu.test(value);

const extractRootDir = (context: RuleContext): string => {
  const cwd = context.cwd;
  const settings = context.settings.fsd;

  if (hasProperty(settings, 'rootDir', isString)) return path.resolve(cwd, settings.rootDir);
  return cwd;
};

const extractAliases = (context: RuleContext): Aliases => {
  const settings = context.settings.fsd;

  if (hasProperty(settings, 'aliases', isAliases)) return settings.aliases;
  return {};
};

const extractOverrides = (context: RuleContext): Overrides => {
  const settings = context.settings.fsd;

  if (hasProperty(settings, 'overrides', isOverrides)) return settings.overrides;
  return {};
};

const extractSegmentContext = (
  path: string,
  context: Pick<FileContext, 'rootDir' | 'overrides'>,
) => {
  const segments = extractSegments(path, context);

  const layerIndex = LAYERS.findIndex((item) =>
    segments.layer ? item.names.includes(segments.layer) : false,
  );

  const hasSlices = LAYERS[layerIndex]?.hasSlices ?? false;

  return {
    layer: segments.layer,
    layerIndex,
    slice: hasSlices ? segments.slice : null,
  };
};

const resolvePath = (node: ImportNode, fileCtx: FileContext): string | null => {
  const importPath = node.source.value;

  if (!isString(importPath)) return null;

  const resolvedAliasedPath = resolveAliasedPath(fileCtx.aliases, importPath);

  if (resolvedAliasedPath !== null) {
    return path.resolve(fileCtx.cwd, resolvedAliasedPath);
  }

  if (isPathRelativeOrAbsolute(importPath)) {
    return path.resolve(path.dirname(fileCtx.path), importPath);
  }

  return importPath;
};

export const extractFileContext = (context: RuleContext): FileContext | null => {
  const cwd = context.cwd;

  const path = context.filename;

  const rootDir = extractRootDir(context);
  const aliases = extractAliases(context);
  const overrides = extractOverrides(context);

  const segmentCtx = extractSegmentContext(path, { rootDir, overrides });

  return {
    cwd,
    path,

    rootDir,
    aliases,
    overrides,

    ...segmentCtx,
  };
};

export const extractImportContext = (
  node: ImportNode,
  fileCtx: FileContext,
): ImportContext | null => {
  const path = resolvePath(node, fileCtx);

  if (!path) return null;

  const segmentCtx = extractSegmentContext(path, fileCtx);

  return { ...segmentCtx };
};
