import { isObject, isString } from '../guards';

type Segments = {
  layer: string;
  slice: string;
};

export type Overrides = { [pattern: string]: Segments };

const ESCAPED_CHARACTERS: string[] = [
  '\\',
  '[',
  ']',
  '{',
  '}',
  '(',
  ')',
  '^',
  '$',
  '.',
  '|',
  '?',
  '+',
];

export const isOverrides = (value: unknown): value is Overrides =>
  isObject(value) &&
  !Array.isArray(value) &&
  Object.values(value).every(
    (item) => isObject(item) && isString(item.layer) && isString(item.slice),
  );

export const matchOverriddenSegments = (overrides: Overrides, path: string) => {
  const matchedPattern = Object.keys(overrides).find((pattern) => {
    const escapedPattern = ESCAPED_CHARACTERS.reduce(
      (acc, character) => acc.replaceAll(character, `\\${character}`),
      pattern,
    );

    return new RegExp(`^${escapedPattern.replaceAll('*', '(.*)')}$`, 'gu').test(
      path,
    );
  });

  return matchedPattern !== undefined ? overrides[matchedPattern] : null;
};
