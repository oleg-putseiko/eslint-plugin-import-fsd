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
  ({ layer: fileLayer, availableLayers, deniedLayers }) => {
    tester.run(
      'import from a segment-level file should be allowed',
      noDeniedLayersRule,
      {
        valid: availableLayers
          .flatMap((availableLayer) => [
            `../../${availableLayer}/foo/bar`,
            `../../${availableLayer}/foo`,
            `../../${availableLayer}`,
          ])
          .map((importPath) => ({
            settings: { fsd: { rootDir: '/src' } },
            filename: `/src/${fileLayer}/foo/bar.js`,
            code: `import foo from "${importPath}";`,
          })),
        invalid: deniedLayers
          .flatMap((layer) => [
            { layer, path: `../../${layer}/foo/bar`, hasSlice: true },
            { layer, path: `../../${layer}/foo`, hasSlice: true },
            { layer, path: `../../${layer}`, hasSlice: false },
          ])
          .map(({ layer, path: importPath, hasSlice }) => ({
            settings: { fsd: { rootDir: '/src' } },
            filename: `/src/${fileLayer}/qux/quux.js`,
            code: `import foo from "${importPath}";`,
            errors: [
              layer === fileLayer && hasSlice
                ? {
                    messageId: 'deniedSlice',
                    data: { file_slice: 'qux', denied_slice: 'foo' },
                  }
                : {
                    messageId: 'deniedLayer',
                    data: { file_layer: fileLayer, denied_layer: layer },
                  },
            ],
          })),
      },
    );

    tester.run(
      'import from a slice-level file should be allowed',
      noDeniedLayersRule,
      {
        valid: availableLayers
          .flatMap((layer) => [
            `../${layer}/foo/bar`,
            `../${layer}/foo`,
            `../${layer}`,
          ])
          .map((importPath) => ({
            settings: { fsd: { rootDir: '/src' } },
            filename: `/src/${fileLayer}/foo.js`,
            code: `import foo from "${importPath}";`,
          })),
        invalid: deniedLayers
          .flatMap((layer) => [
            { layer, path: `../${layer}/foo/bar`, hasSlice: true },
            { layer, path: `../${layer}/foo`, hasSlice: true },
            { layer, path: `../${layer}`, hasSlice: false },
          ])
          .map(({ layer, path: importPath, hasSlice }) => ({
            settings: { fsd: { rootDir: '/src' } },
            filename: `/src/${fileLayer}/qux.js`,
            code: `import foo from "${importPath}";`,
            errors: [
              layer === fileLayer && hasSlice
                ? {
                    messageId: 'deniedSlice',
                    data: { file_slice: 'qux', denied_slice: 'foo' },
                  }
                : {
                    messageId: 'deniedLayer',
                    data: { file_layer: fileLayer, denied_layer: layer },
                  },
            ],
          })),
      },
    );

    tester.run(
      'import from a layer-level file should be allowed',
      noDeniedLayersRule,
      {
        valid: availableLayers
          .flatMap((layer) => [
            `./${layer}/foo/bar`,
            `./${layer}/foo`,
            `./${layer}`,
          ])
          .map((importPath) => ({
            settings: { fsd: { rootDir: '/src' } },
            filename: `/src/${fileLayer}.js`,
            code: `import foo from "${importPath}";`,
          })),
        invalid: deniedLayers
          .flatMap((layer) => [
            { layer, path: `./${layer}/foo/bar`, hasSlice: true },
            { layer, path: `./${layer}/foo`, hasSlice: true },
            { layer, path: `./${layer}`, hasSlice: false },
          ])
          .map(({ layer, path: importPath }) => ({
            settings: { fsd: { rootDir: '/src' } },
            filename: `/src/${fileLayer}.js`,
            code: `import foo from "${importPath}";`,
            errors: [
              {
                messageId: 'deniedLayer',
                data: { file_layer: fileLayer, denied_layer: layer },
              },
            ],
          })),
      },
    );
  },
);
