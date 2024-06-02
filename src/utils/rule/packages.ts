import { isObject, isString } from '../guards';

type Segments = {
  layer: string;
  slice: string;
};

export type Packages = { [packagePattern: string]: Segments };

export const isPackages = (value: unknown): value is Packages =>
  isObject(value) &&
  Object.values(value).every(
    (entry) =>
      isObject(entry) && isString(entry.layer) && isString(entry.slice),
  );

export const matchPackageSegments = (packages: Packages, path: string) => {
  const matchedPattern = Object.keys(packages).find((pattern) =>
    new RegExp(`^${pattern.replaceAll('*', '(.*)')}$`, 'gu').test(path),
  );

  return matchedPattern !== undefined ? packages[matchedPattern] : null;
};
