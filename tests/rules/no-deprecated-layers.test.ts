import { RuleTester } from 'eslint';

import plugin from '../../dist';

// prettier-ignore
const NON_DEPRECATED_LAYERS: string[] = [
  'app', 'apps',
  'page', 'pages',
  'widget', 'widgets',
  'feature', 'features',
  'entity', 'entities',
  'shared',
  'unknown-layer',
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

const tester = new RuleTester({
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
});

const noDeprecatedLayersRule = plugin.rules['no-deprecated-layers'];

describe.each(NON_DEPRECATED_LAYERS)('%s file layer', (fileLayer) => {
  tester.run(
    'import from a segment-level file should be allowed',
    noDeprecatedLayersRule,
    {
      valid: NON_DEPRECATED_LAYERS.flatMap((layer) => [
        `../../${layer}/foo/bar`,
        `../../${layer}/foo`,
        `../../${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'file' }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
        },
      ]),
      invalid: DEPRECATED_LAYERS.flatMap((layer) => [
        `../../${layer}/foo/bar`,
        `../../${layer}/foo`,
        `../../${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'replaceableDeprecatedImportLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'replaceableDeprecatedImportLayer' }],
        },
      ]),
    },
  );

  tester.run(
    'import from a slice-level file should be allowed',
    noDeprecatedLayersRule,
    {
      valid: NON_DEPRECATED_LAYERS.flatMap((layer) => [
        `../${layer}/foo/bar`,
        `../${layer}/foo`,
        `../${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'file' }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
        },
      ]),
      invalid: DEPRECATED_LAYERS.flatMap((layer) => [
        `../${layer}/foo/bar`,
        `../${layer}/foo`,
        `../${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'replaceableDeprecatedImportLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'replaceableDeprecatedImportLayer' }],
        },
      ]),
    },
  );

  tester.run(
    'import from a layer-level file should be allowed',
    noDeprecatedLayersRule,
    {
      valid: NON_DEPRECATED_LAYERS.flatMap((layer) => [
        `./${layer}/foo/bar`,
        `./${layer}/foo`,
        `./${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'file' }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
        },
      ]),
      invalid: DEPRECATED_LAYERS.flatMap((layer) => [
        `./${layer}/foo/bar`,
        `./${layer}/foo`,
        `./${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'replaceableDeprecatedImportLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'replaceableDeprecatedImportLayer' }],
        },
      ]),
    },
  );
});

describe.each(DEPRECATED_LAYERS)('deprecated %s file layer', (fileLayer) => {
  tester.run(
    'import from a segment-level file should be allowed',
    noDeprecatedLayersRule,
    {
      valid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'import' }],
          code: 'import foo from "bar"',
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'file', ignores: [fileLayer] }],
          code: 'import foo from "bar"',
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'all', ignores: [fileLayer] }],
          code: 'import foo from "bar"',
        },
      ],
      invalid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'file' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'all' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
      ],
    },
  );

  tester.run(
    'import from a slice-level file should be allowed',
    noDeprecatedLayersRule,
    {
      valid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'import' }],
          code: 'import foo from "bar"',
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'file', ignores: [fileLayer] }],
          code: 'import foo from "bar"',
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'all', ignores: [fileLayer] }],
          code: 'import foo from "bar"',
        },
      ],
      invalid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'file' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'all' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
      ],
    },
  );

  tester.run(
    'import from a layer-level file should be allowed',
    noDeprecatedLayersRule,
    {
      valid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'import' }],
          code: 'import foo from "bar"',
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'file', ignores: [fileLayer] }],
          code: 'import foo from "bar"',
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'all', ignores: [fileLayer] }],
          code: 'import foo from "bar"',
        },
      ],
      invalid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'file' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'all' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
      ],
    },
  );
});
