import { isObject, isString } from '../guards';

type Segments = {
  layer: string;
  slice: string;
};

export type Overrides = { [pattern: string]: Segments };

export const isOverrides = (value: unknown): value is Overrides =>
  isObject(value) &&
  Object.values(value).every(
    (item) => isObject(item) && isString(item.layer) && isString(item.slice),
  );

export const matchOverriddenSegments = (overrides: Overrides, path: string) => {
  const matchedPattern = Object.keys(overrides).find((pattern) =>
    new RegExp(`^${pattern.replaceAll('*', '(.*)')}$`, 'gu').test(path),
  );

  return matchedPattern !== undefined ? overrides[matchedPattern] : null;
};
