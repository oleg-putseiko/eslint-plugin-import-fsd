export const PATH_REGEXPS = {
  fileName: /\/[^\\/]*$/iu,
  fileExtension: /(.+)(\.[^\\.]+$)/iu,
  relativePath: /^\.+\//iu,
  relativeOrAbsolutePath: /^\.*\//iu,
  segments: /[^\\/]+/giu,
} as const satisfies Record<string, RegExp>;

export const resolve = (rootDir: string, path: string) => {
  const inputStr = PATH_REGEXPS.relativePath.test(path)
    ? `${rootDir}/${path}`
    : path;
  const inputSegments = inputStr.split('/');
  const resultSegments: string[] = [];

  const isAbsolute = inputStr.startsWith('/');

  while (inputSegments.length > 0) {
    const segment = inputSegments[0];

    switch (segment) {
      case '':
      case '.':
        break;

      case '..': {
        const isResultSegmentRemovable =
          resultSegments.length > 0 && !resultSegments.at(-1)?.match(/^\.+$/iu);

        if (isAbsolute || isResultSegmentRemovable) resultSegments.pop();
        else if (!isAbsolute) resultSegments.push(segment);

        break;
      }

      default:
        resultSegments.push(segment);
        break;
    }

    inputSegments.shift();
  }

  const joinedSegments = resultSegments.join('/');

  return isAbsolute ? `/${joinedSegments}` : joinedSegments || '.';
};
