import { RuleTester } from 'eslint';

import plugin from '../../src';

const UNKNOWN_LAYERS: string[] = ['unknown-layer'];

// prettier-ignore
const NON_DEPRECATED_LAYERS: string[] = [
  'app', 'apps',
  'page', 'pages',
  'widget', 'widgets',
  'feature', 'features',
  'entity', 'entities',
  'shared',
  ...UNKNOWN_LAYERS,
];

// prettier-ignore
const DEPRECATED_LAYERS: string[] = [
  'core', 'init', 
  'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
  'screen', 'screens', 'view', 'views', 'layout', 'layouts',
  'component', 'components', 'container', 'containers',
  'model', 'models',
  'common', 'lib', 'libs',
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

const noDeprecatedLayersRule = plugin.rules['no-deprecated-layers'];

describe.each(NON_DEPRECATED_LAYERS)('file layer "%s"', (fileLayer) => {
  IMPORT_LEVELS.forEach(({ description, prefix, getFilename }) => {
    const isUnknownFileLayer = UNKNOWN_LAYERS.includes(fileLayer);
    const filename = getFilename(fileLayer);

    const valid: RuleTester.ValidTestCase[] = [];
    const invalid: RuleTester.InvalidTestCase[] = [];

    NON_DEPRECATED_LAYERS.forEach((layer) => {
      PATH_SUFFIXES.forEach((suffix) => {
        const code = `import foo from "${prefix}${layer}${suffix}";`;

        SCOPES_ALL.forEach((scope) => {
          valid.push({ settings: BASE_SETTINGS, filename, options: [{ scope }], code });
        });
      });
    });

    DEPRECATED_LAYERS.forEach((layer) => {
      PATH_SUFFIXES.forEach((suffix) => {
        const code = `import foo from "${prefix}${layer}${suffix}";`;

        // Allowed: ignored import layer
        SCOPES_IMPORT.forEach((scope) => {
          valid.push({
            settings: BASE_SETTINGS,
            filename,
            options: [{ scope, ignores: [layer] }],
            code,
          });
        });

        // Allowed: non-influencing import layer in the file scope
        valid.push({ settings: BASE_SETTINGS, filename, options: [{ scope: 'file' }], code });

        // Allowed: unknown file layer
        if (isUnknownFileLayer) {
          SCOPES_IMPORT.forEach((scope) => {
            valid.push({ settings: BASE_SETTINGS, filename, options: [{ scope }], code });
          });
        } else {
          // Deprecated: import layer
          SCOPES_IMPORT.forEach((scope) => {
            invalid.push({
              settings: BASE_SETTINGS,
              filename,
              options: [{ scope }],
              code,
              errors: [{ messageId: 'replaceableDeprecatedImportLayer' }],
            });
          });
        }
      });
    });

    tester.run(
      `import from a ${description} file should be handled correctly`,
      noDeprecatedLayersRule,
      { valid, invalid },
    );
  });
});

describe.each(DEPRECATED_LAYERS)('deprecated file layer "%s"', (fileLayer) => {
  IMPORT_LEVELS.forEach(({ description, getFilename }) => {
    const filename = getFilename(fileLayer);
    const code = 'import foo from "bar";';

    const valid: RuleTester.ValidTestCase[] = [
      // Allowed: non-influencing file layer in the import scope
      { settings: BASE_SETTINGS, filename, options: [{ scope: 'import' }], code },
    ];
    const invalid: RuleTester.InvalidTestCase[] = [];

    SCOPES_FILE.forEach((scope) => {
      // Allowed: ignored file layer
      valid.push({
        settings: BASE_SETTINGS,
        filename,
        options: [{ scope, ignores: [fileLayer] }],
        code,
      });

      // Deprecated: file layer
      invalid.push({
        settings: BASE_SETTINGS,
        filename,
        options: [{ scope }],
        code,
        errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
      });
    });

    tester.run(
      `import from a ${description} file should be handled correctly`,
      noDeprecatedLayersRule,
      { valid, invalid },
    );
  });
});
