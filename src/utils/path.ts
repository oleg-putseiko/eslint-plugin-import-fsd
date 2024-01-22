export const PATH_REGEXPS = {
  relativeStart: /^\.+\//u,
  relativeOrAbsoluteStart: /^\.*\//u,

  segments: /[^\\/]+/gu,

  fileName: /\/[^\\/]*$/u,
  fileExtension: /(.+)(\.[^\\.]+$)/u,

  currentDirDotSegment: /(?<=(^|\/))\.\//gu,
  currentDirEndingDotSegment: /\/\.?\/?$/u,
  prevDirSegmentPair: /(^|([^\\/]*\/))\.{2}(\/|$)/u,
  extraSlashes: /\/{2,}/gu,
} satisfies Record<string, RegExp>;

export const resolvePath = (dir: string, path: string) => {
  if (!PATH_REGEXPS.relativeOrAbsoluteStart.test(path)) return path;

  let resolvedPath = (
    PATH_REGEXPS.relativeStart.test(path) ? `${dir}/${path}` : path
  )
    .replaceAll(PATH_REGEXPS.currentDirDotSegment, '')
    .replaceAll(PATH_REGEXPS.extraSlashes, '/')
    .replace(PATH_REGEXPS.currentDirEndingDotSegment, '');

  while (PATH_REGEXPS.prevDirSegmentPair.test(resolvedPath)) {
    resolvedPath = resolvedPath.replace(PATH_REGEXPS.prevDirSegmentPair, '');
  }

  return resolvedPath.replace(/\/+$/u, '');
};
