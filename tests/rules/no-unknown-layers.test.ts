import { RuleTester } from 'eslint';

import plugin from '../../dist';

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

const tester = new RuleTester({
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
});

const noUnknownLayersRule = plugin.rules['no-unknown-layers'];

describe.each(KNOWN_LAYERS)('file layer "%s"', (fileLayer) => {
  tester.run(
    'import from a segment-level file should be allowed',
    noUnknownLayersRule,
    {
      valid: KNOWN_LAYERS.flatMap((layer) => [
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
      invalid: UNKNOWN_LAYERS.flatMap((layer) => [
        `../../${layer}/foo/bar`,
        `../../${layer}/foo`,
        `../../${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownImportLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownImportLayer' }],
        },
      ]),
    },
  );

  tester.run(
    'import from a slice-level file should be allowed',
    noUnknownLayersRule,
    {
      valid: KNOWN_LAYERS.flatMap((layer) => [
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
      invalid: UNKNOWN_LAYERS.flatMap((layer) => [
        `../${layer}/foo/bar`,
        `../${layer}/foo`,
        `../${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownImportLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownImportLayer' }],
        },
      ]),
    },
  );

  tester.run(
    'import from a layer-level file should be allowed',
    noUnknownLayersRule,
    {
      valid: KNOWN_LAYERS.flatMap((layer) => [
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
      invalid: UNKNOWN_LAYERS.flatMap((layer) => [
        `./${layer}/foo/bar`,
        `./${layer}/foo`,
        `./${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownImportLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownImportLayer' }],
        },
      ]),
    },
  );
});

describe.each(UNKNOWN_LAYERS)('unknown file layer "%s"', (fileLayer) => {
  tester.run(
    'import from a segment-level file should be allowed',
    noUnknownLayersRule,
    {
      valid: KNOWN_LAYERS.flatMap((layer) => [
        `../../${layer}/foo/bar`,
        `../../${layer}/foo`,
        `../../${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'file', ignores: [fileLayer] }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'all', ignores: [fileLayer] }],
          code: `import foo from "${importPath}"`,
        },
      ]),
      invalid: KNOWN_LAYERS.flatMap((layer) => [
        `../../${layer}/foo/bar`,
        `../../${layer}/foo`,
        `../../${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'file' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownFileLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownFileLayer' }],
        },
      ]),
    },
  );

  tester.run(
    'import from a slice-level file should be allowed',
    noUnknownLayersRule,
    {
      valid: KNOWN_LAYERS.flatMap((layer) => [
        `../${layer}/foo/bar`,
        `../${layer}/foo`,
        `../${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'file', ignores: [fileLayer] }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'all', ignores: [fileLayer] }],
          code: `import foo from "${importPath}"`,
        },
      ]),
      invalid: KNOWN_LAYERS.flatMap((layer) => [
        `../${layer}/foo/bar`,
        `../${layer}/foo`,
        `../${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'file' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownFileLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownFileLayer' }],
        },
      ]),
    },
  );

  tester.run(
    'import from a layer-level file should be allowed',
    noUnknownLayersRule,
    {
      valid: KNOWN_LAYERS.flatMap((layer) => [
        `./${layer}/foo/bar`,
        `./${layer}/foo`,
        `./${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'import' }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'file', ignores: [fileLayer] }],
          code: `import foo from "${importPath}"`,
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'all', ignores: [fileLayer] }],
          code: `import foo from "${importPath}"`,
        },
      ]),
      invalid: KNOWN_LAYERS.flatMap((layer) => [
        `./${layer}/foo/bar`,
        `./${layer}/foo`,
        `./${layer}`,
      ]).flatMap((importPath) => [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'file' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownFileLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'all' }],
          code: `import foo from "${importPath}"`,
          errors: [{ messageId: 'unknownFileLayer' }],
        },
      ]),
    },
  );
});
