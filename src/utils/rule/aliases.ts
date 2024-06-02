import { isObject, isString } from '../guards';

export type Aliases = { [alias: string]: string };

export const isAliases = (value: unknown): value is Aliases =>
  isObject(value) &&
  Object.keys(value).every((key) => isString(key) && isString(value[key]));

export const resolveAliasedPath = (aliases: Aliases, path: string) => {
  const patterns = Object.keys(aliases);

  for (const pattern of patterns) {
    const replacement = RegExp(`^${pattern.replace('*', '(.*)')}$`, 'iu')
      .exec(path)
      ?.at(1);

    if (replacement !== undefined) {
      return aliases[pattern].replace('*', replacement);
    }
  }

  return null;
};
