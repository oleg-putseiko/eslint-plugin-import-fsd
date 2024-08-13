import { isObject, isString } from '../guards';

export type Aliases = { [alias: string]: string };

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

export const isAliases = (value: unknown): value is Aliases =>
  isObject(value) &&
  !Array.isArray(value) &&
  Object.keys(value).every((key) => isString(key) && isString(value[key]));

export const resolveAliasedPath = (aliases: Aliases, path: string) => {
  const patterns = Object.keys(aliases);

  for (const pattern of patterns) {
    const escapedPattern = ESCAPED_CHARACTERS.reduce(
      (acc, character) => acc.replaceAll(character, `\\${character}`),
      pattern,
    );
    const replacement = RegExp(`^${escapedPattern.replace('*', '(.*)')}$`, 'iu')
      .exec(path)
      ?.at(1);

    if (replacement !== undefined) {
      return aliases[pattern].replace('*', replacement);
    }
  }

  return null;
};
