type AnyObject = Record<string | number | symbol, unknown>;

export const isObject = (value: unknown): value is AnyObject =>
  typeof value === 'object' && value !== null;

export const isString = (value: unknown): value is string => typeof value === 'string';

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);

export const hasProperty = <K extends string | number, TResult = unknown>(
  value: unknown,
  key: K,
  predicate?: (value: unknown) => value is TResult,
): value is { [_ in K]: TResult } =>
  isObject(value) && key in value && (predicate?.(value[key]) ?? true);
