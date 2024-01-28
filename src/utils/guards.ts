type AnyObject = Record<string | number | symbol, unknown>;

export const isObject = (value: unknown): value is AnyObject =>
  typeof value === 'object' && value !== null;

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);
