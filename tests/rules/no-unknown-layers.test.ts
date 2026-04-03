import { RuleTester } from 'eslint';

import plugin from '../../src';

const UNKNOWN_LAYERS: string[] = ['unknown-layer'];

// prettier-ignore
const KNOWN_LAYERS: string[] = [
  'app', 'apps', 'core', 'init',
  'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
  'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
  'widget', 'widgets',
  'feature', 'features', 'component', 'components', 'container', 'containers',
  'entity', 'entities', 'model', 'models',
  'shared', 'common', 'lib', 'libs',
];

const IMPORT_LEVELS = [
  {
    description: 'segment-level',
    prefix: '../../',
    getFilename: (layer: string) => `/src/${layer}/qux/quux.js`,
  },
  {
    description: 'slice-level',
    prefix: '../',
    getFilename: (layer: string) => `/src/${layer}/qux.js`,
  },
  {
    description: 'layer-level',
    prefix: './',
    getFilename: (layer: string) => `/src/${layer}.js`,
  },
];

const PATH_SUFFIXES = ['/foo/bar', '/foo', ''];

const SCOPES_ALL = ['file', 'import', 'all'] as const;
const SCOPES_IMPORT = ['import', 'all'] as const;
const SCOPES_FILE = ['file', 'all'] as const;

const BASE_SETTINGS = { fsd: { rootDir: '/src' } };

const tester = new RuleTester({
  languageOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
});

const noUnknownLayersRule = plugin.rules['no-unknown-layers'];

describe.each(KNOWN_LAYERS)('file layer "%s"', (fileLayer) => {
  IMPORT_LEVELS.forEach(({ description, prefix, getFilename }) => {
    const filename = getFilename(fileLayer);

    const valid: RuleTester.ValidTestCase[] = [];
    const invalid: RuleTester.InvalidTestCase[] = [];

    KNOWN_LAYERS.forEach((layer) => {
      PATH_SUFFIXES.forEach((suffix) => {
        const code = `import foo from "${prefix}${layer}${suffix}";`;

        SCOPES_ALL.forEach((scope) => {
          valid.push({ settings: BASE_SETTINGS, filename, options: [{ scope }], code });
        });
      });
    });

    UNKNOWN_LAYERS.forEach((layer) => {
      PATH_SUFFIXES.forEach((suffix) => {
        const code = `import foo from "${prefix}${layer}${suffix}";`;

        SCOPES_IMPORT.forEach((scope) => {
          // Allowed: ignored unknown import layer
          valid.push({
            settings: BASE_SETTINGS,
            filename,
            options: [{ scope, ignores: [layer] }],
            code,
          });

          // Disallowed: unknown import layer
          invalid.push({
            settings: BASE_SETTINGS,
            filename,
            options: [{ scope }],
            code,
            errors: [{ messageId: 'unknownImportLayer' }],
          });
        });
      });
    });

    tester.run(`import from a ${description} file should be allowed`, noUnknownLayersRule, {
      valid,
      invalid,
    });
  });
});

describe.each(UNKNOWN_LAYERS)('unknown file layer "%s"', (fileLayer) => {
  IMPORT_LEVELS.forEach(({ description, prefix, getFilename }) => {
    const filename = getFilename(fileLayer);

    const valid: RuleTester.ValidTestCase[] = [];
    const invalid: RuleTester.InvalidTestCase[] = [];

    KNOWN_LAYERS.forEach((layer) => {
      PATH_SUFFIXES.forEach((suffix) => {
        const code = `import foo from "${prefix}${layer}${suffix}";`;

        // Allowed: skipped unknown file layer in the import scope
        valid.push({ settings: BASE_SETTINGS, filename, options: [{ scope: 'import' }], code });

        SCOPES_FILE.forEach((scope) => {
          // Allowed: ignored unknown file layer
          valid.push({
            settings: BASE_SETTINGS,
            filename,
            options: [{ scope, ignores: [fileLayer] }],
            code,
          });

          // Disallowed: unknown file layer
          invalid.push({
            settings: BASE_SETTINGS,
            filename,
            options: [{ scope }],
            code,
            errors: [{ messageId: 'unknownFileLayer' }],
          });
        });
      });
    });

    tester.run(`import from a ${description} file should be allowed`, noUnknownLayersRule, {
      valid,
      invalid,
    });
  });
});
