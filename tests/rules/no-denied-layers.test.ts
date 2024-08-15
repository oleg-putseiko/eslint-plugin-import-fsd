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
      'unknown-layer'
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
      'unknown-layer'
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
      'unknown-layer'
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
      'unknown-layer'
    ],
    deniedLayers: ['app', 'apps', 'core', 'init'],
  },
  {
    layer: 'process',
    // prettier-ignore
    availableLayers: [
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
    ],
  },
  {
    layer: 'processes',
    // prettier-ignore
    availableLayers: [
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
    ],
  },
  {
    layer: 'flow',
    // prettier-ignore
    availableLayers: [
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
    ],
  },
  {
    layer: 'flows',
    // prettier-ignore
    availableLayers: [
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
    ],
  },
  {
    layer: 'workflow',
    // prettier-ignore
    availableLayers: [
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
    ],
  },
  {
    layer: 'workflows',
    // prettier-ignore
    availableLayers: [
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
    ],
  },
  {
    layer: 'page',
    // prettier-ignore
    availableLayers: [
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
    ],
  },
  {
    layer: 'pages',
    // prettier-ignore
    availableLayers: [
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
    ],
  },
  {
    layer: 'screen',
    // prettier-ignore
    availableLayers: [
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
    ],
  },
  {
    layer: 'screens',
    // prettier-ignore
    availableLayers: [
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
    ],
  },
  {
    layer: 'view',
    // prettier-ignore
    availableLayers: [
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
    ],
  },
  {
    layer: 'views',
    // prettier-ignore
    availableLayers: [
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
    ],
  },
  {
    layer: 'layout',
    // prettier-ignore
    availableLayers: [
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
    ],
  },
  {
    layer: 'layouts',
    // prettier-ignore
    availableLayers: [
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
    ],
  },
  {
    layer: 'widget',
    // prettier-ignore
    availableLayers: [
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
    ],
  },
  {
    layer: 'widgets',
    // prettier-ignore
    availableLayers: [
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
    ],
  },
  {
    layer: 'feature',
    // prettier-ignore
    availableLayers: [
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
    ],
  },
  {
    layer: 'features',
    // prettier-ignore
    availableLayers: [
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
    ],
  },
  {
    layer: 'component',
    // prettier-ignore
    availableLayers: [
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
    ],
  },
  {
    layer: 'components',
    // prettier-ignore
    availableLayers: [
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
    ],
  },
  {
    layer: 'container',
    // prettier-ignore
    availableLayers: [
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
    ],
  },
  {
    layer: 'containers',
    // prettier-ignore
    availableLayers: [
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
    ],
  },
  {
    layer: 'entity',
    // prettier-ignore
    availableLayers: [
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
    ],
  },
  {
    layer: 'entities',
    // prettier-ignore
    availableLayers: [
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
    ],
  },
  {
    layer: 'model',
    // prettier-ignore
    availableLayers: [
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
    ],
  },
  {
    layer: 'models',
    // prettier-ignore
    availableLayers: [
      'shared', 'common', 'lib', 'libs',
      'unknown-layer'
    ],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
    ],
  },
  {
    layer: 'shared',
    availableLayers: ['unknown-layer'],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
    ],
  },
  {
    layer: 'common',
    availableLayers: ['unknown-layer'],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
    ],
  },
  {
    layer: 'lib',
    availableLayers: ['unknown-layer'],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
    ],
  },
  {
    layer: 'libs',
    availableLayers: ['unknown-layer'],
    // prettier-ignore
    deniedLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
    ],
  },
  {
    layer: 'unknown-layer',
    // prettier-ignore
    availableLayers: [
      'app', 'apps', 'core', 'init', 
      'process', 'processes', 'flow', 'flows', 'workflow', 'workflows',
      'page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts',
      'widget', 'widgets',
      'feature', 'features', 'component', 'components', 'container', 'containers',
      'entity', 'entities', 'model', 'models',
      'shared', 'common', 'lib', 'libs',
      'unknown-layer', 'other-unknown-layer'
    ],
    deniedLayers: [],
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

// TODO: add `ignores` options tests
describe.each(TEST_ITEMS)(
  '$layer layer',
  ({ layer: fileLayer, availableLayers, deniedLayers }) => {
    tester.run(
      'import from a segment-level file should be allowed',
      noDeniedLayersRule,
      {
        valid: [
          ...availableLayers
            .flatMap((layer) => [
              `../../${layer}/foo/bar`,
              `../../${layer}/foo`,
              `../../${layer}`,
            ])
            .map((importPath) => ({
              settings: { fsd: { rootDir: '/src' } },
              filename: `/src/${fileLayer}/foo/bar.js`,
              code: `import foo from "${importPath}";`,
            })),
          ...deniedLayers
            .flatMap((layer) => [
              { layer, path: `../../${layer}/foo/bar` },
              { layer, path: `../../${layer}/foo` },
              { layer, path: `../../${layer}` },
            ])
            .map(({ layer: importLayer, path: importPath }) => ({
              settings: { fsd: { rootDir: '/src' } },
              filename: `/src/${fileLayer}/foo/bar.js`,
              options: [{ ignores: [importLayer] }],
              code: `import foo from "${importPath}";`,
            })),
        ],
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
        valid: [
          ...availableLayers
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
          ...deniedLayers
            .flatMap((layer) => [
              { layer, path: `../${layer}/foo/bar` },
              { layer, path: `../${layer}/foo` },
              { layer, path: `../${layer}` },
            ])
            .map(({ layer: importLayer, path: importPath }) => ({
              settings: { fsd: { rootDir: '/src' } },
              filename: `/src/${fileLayer}/foo.js`,
              options: [{ ignores: [importLayer] }],
              code: `import foo from "${importPath}";`,
            })),
        ],
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
        valid: [
          ...availableLayers
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
          ...deniedLayers
            .flatMap((layer) => [
              { layer, path: `./${layer}/foo/bar` },
              { layer, path: `./${layer}/foo` },
              { layer, path: `./${layer}` },
            ])
            .map(({ layer: importLayer, path: importPath }) => ({
              settings: { fsd: { rootDir: '/src' } },
              filename: `/src/${fileLayer}.js`,
              options: [{ ignores: [importLayer] }],
              code: `import foo from "${importPath}";`,
            })),
        ],
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
