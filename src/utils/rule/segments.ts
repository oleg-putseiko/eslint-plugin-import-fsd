import * as path from 'node:path';

import { matchOverriddenSegments, type Overrides } from './overrides';

type ShallowNullable<T> = T extends Record<infer K, unknown>
  ? { [X in K]: T[K] | null }
  : T | null;

export type Segments = {
  layer: string;
  slice: string;
};

export type SegmentsContext = {
  rootDir: string;
  overrides: Overrides;
};

export const extractSegments = (
  fullPath: string,
  context: SegmentsContext,
): ShallowNullable<Segments> => {
  const { rootDir, overrides } = context;

  const overriddenSegments = matchOverriddenSegments(overrides, fullPath);

  if (overriddenSegments !== null) return overriddenSegments;

  if (!fullPath.startsWith(rootDir)) {
    return { layer: null, slice: null };
  }

  const pathFromRoot = path.relative(rootDir, fullPath);
  const segments =
    pathFromRoot.length > 0
      ? path
          .normalize(pathFromRoot)
          .split(path.sep)
          .filter((segment) => segment.length > 0)
      : [];

  const layer =
    segments.length > 0 ? path.parse(segments[0]).name || null : null;
  const slice =
    segments.length > 1 ? path.parse(segments[1]).name || null : null;

  return { layer, slice };
};
