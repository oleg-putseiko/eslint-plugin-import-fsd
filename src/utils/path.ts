export const PATH_REGEXPS = {
  relative: /^\.+\//u,
  relativeOrAbsolute: /^\.*\//u,

  segments: /[^\\/]+/gu,

  fileName: /\/[^\\/]*$/u,
  fileExtension: /(.+)(\.[^\\.]+$)/u,
} satisfies Record<string, RegExp>;

export const resolvePath = (dir: string, path: string) => {
  if (!PATH_REGEXPS.relativeOrAbsolute.test(path)) return path;

  let resolvedPath = (
    PATH_REGEXPS.relative.test(path) ? `${dir}/${path}` : path
  )
    // Remove '/./', '/.' and '/' from the end
    .replace(/\/\.?\/?$/u, '')
    // Remove './'
    .replaceAll(/(?<=(^|\/))\.\//gu, '');

  while (/(^|([^\\/]*\/))\.{2}(\/|$)/u.test(resolvedPath)) {
    // Remove 'foo/../'
    resolvedPath = resolvedPath.replace(/(^|([^\\/]*\/))\.{2}(\/|$)/u, '');
  }

  return resolvedPath.replace(/\/+$/u, '');
};
