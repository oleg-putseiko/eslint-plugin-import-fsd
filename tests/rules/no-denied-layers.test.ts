import { RuleTester } from 'eslint';

import plugin from '../../dist';

type TestItem = {
  layer: string;
  availableLayers: string[];
  deniedLayers: string[];
};

const TEST_ITEMS: TestItem[] = [
  {
    layer: 'app',
    // prettier-ignore
    availableLayers: [
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer', 'qwe'
    ],
    deniedLayers: ['app', 'apps', 'core', 'init'],
  },
  {
    layer: 'apps',
    // prettier-ignore
    availableLayers: [
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer', 'qwe'
    ],
    deniedLayers: ['app', 'apps', 'core', 'init'],
  },
  {
    layer: 'core',
    // prettier-ignore
    availableLayers: [
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer', 'qwe'
    ],
    deniedLayers: ['app', 'apps', 'core', 'init'],
  },
  {
    layer: 'init',
    // prettier-ignore
    availableLayers: [
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer', 'qwe'
    ],
    deniedLayers: ['app', 'apps', 'core', 'init'],
  },
];

const tester = new RuleTester({
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
});

const noDeniedLayersRule = plugin.rules['no-denied-layers'];

describe.each(TEST_ITEMS)(
  '$layer layer',
  ({ layer, availableLayers, deniedLayers }) => {
    tester.run(
      'segment-level imports from a segment-level file should be allowed',
      noDeniedLayersRule,
      {
        valid: availableLayers
          .flatMap((availableLayer) => [
            `../../${availableLayer}/foo/bar`,
            `@/${availableLayer}/foo/bar`,
            `~/${availableLayer}/foo/bar`,
            `prefix/${availableLayer}/foo/bar`,
          ])
          .map((importPath) => ({
            settings: {
              fsd: {
                rootDir: '/users/user/projects/plugin/src',
                aliases: {
                  '@/*': './*',
                  '~/*': './*',
                  'prefix/*': './*',
                },
              },
            },
            filename: `/users/user/projects/plugin/src/${layer}/foo/bar.js`,
            code: `import foo from "${importPath}";`,
          })),
        invalid: deniedLayers
          .flatMap((deniedLayer) => [
            { deniedLayer, importPath: `../../${deniedLayer}/foo/bar` },
            { deniedLayer, importPath: `@/${deniedLayer}/foo/bar` },
            { deniedLayer, importPath: `~/${deniedLayer}/foo/bar` },
            { deniedLayer, importPath: `prefix/${deniedLayer}/foo/bar` },
          ])
          .map(({ deniedLayer, importPath }) => ({
            settings: {
              fsd: {
                rootDir: '/users/user/projects/plugin/src',
                aliases: {
                  '@/*': './*',
                  '~/*': './*',
                  'prefix/*': './*',
                },
              },
            },
            filename: `/users/user/projects/plugin/src/${layer}/qux/quux.js`,
            code: `import foo from "${importPath}";`,
            errors: [
              deniedLayer === layer
                ? {
                    messageId: 'deniedSlice',
                    data: { file_slice: 'qux', denied_slice: 'foo' },
                  }
                : {
                    messageId: 'deniedLayer',
                    data: { file_layer: layer, denied_layer: deniedLayer },
                  },
            ],
          })),
      },
    );

    tester.run(
      'segment-level imports from a slice-level file should be allowed',
      noDeniedLayersRule,
      {
        valid: availableLayers
          .flatMap((availableLayer) => [
            `../${availableLayer}/foo/bar`,
            `@/${availableLayer}/foo/bar`,
            `~/${availableLayer}/foo/bar`,
            `prefix/${availableLayer}/foo/bar`,
          ])
          .map((importPath) => ({
            settings: {
              fsd: {
                rootDir: '/users/user/projects/plugin/src',
                aliases: {
                  '@/*': './*',
                  '~/*': './*',
                  'prefix/*': './*',
                },
              },
            },
            filename: `/users/user/projects/plugin/src/${layer}/foo.js`,
            code: `import foo from "${importPath}";`,
          })),
        invalid: deniedLayers
          .flatMap((deniedLayer) => [
            { deniedLayer, importPath: `../${deniedLayer}/foo/bar` },
            { deniedLayer, importPath: `@/${deniedLayer}/foo/bar` },
            { deniedLayer, importPath: `~/${deniedLayer}/foo/bar` },
            { deniedLayer, importPath: `prefix/${deniedLayer}/foo/bar` },
          ])
          .map(({ deniedLayer, importPath }) => ({
            settings: {
              fsd: {
                rootDir: '/users/user/projects/plugin/src',
                aliases: {
                  '@/*': './*',
                  '~/*': './*',
                  'prefix/*': './*',
                },
              },
            },
            filename: `/users/user/projects/plugin/src/${layer}/qux.js`,
            code: `import foo from "${importPath}";`,
            errors: [
              deniedLayer === layer
                ? {
                    messageId: 'deniedSlice',
                    data: { file_slice: 'qux', denied_slice: 'foo' },
                  }
                : {
                    messageId: 'deniedLayer',
                    data: { file_layer: layer, denied_layer: deniedLayer },
                  },
            ],
          })),
      },
    );
  },
);
