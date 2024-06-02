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

const FILE_EXT_REGEXP = /(.+)(\.[^\\.]+$)/iu;

export const extractSegments = (
  fullPath: string,
  segmentsContext: SegmentsContext,
): ShallowNullable<Segments> => {
  const { rootDir, overrides } = segmentsContext;

  const overriddenSegments = matchOverriddenSegments(overrides, fullPath);

  if (overriddenSegments !== null) return overriddenSegments;

  if (!fullPath.startsWith(rootDir)) {
    return { layer: null, slice: null };
  }

  const pathFromRoot = path.relative(rootDir, fullPath);
  const pathSegments =
    pathFromRoot !== ''
      ? path
          .normalize(pathFromRoot)
          .split(path.sep)
          .filter((segment) => segment.length > 0)
      : [];

  const layer = pathSegments.at(0) || null;
  const slice =
    (pathSegments.length > 2
      ? pathSegments.at(1)
      : pathSegments.at(1)?.replace(FILE_EXT_REGEXP, '$1')) || null;

  return { layer, slice };
};
