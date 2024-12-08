import { RuleTester } from 'eslint';

import plugin from '../../src';

type TestItem = {
  layer: string;
  availableLayers: string[];
  deniedLayers: string[];
  hasSlices: boolean;
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
    hasSlices: false,
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
    hasSlices: false,
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
    hasSlices: false,
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
    hasSlices: false,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: true,
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
    hasSlices: false,
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
    hasSlices: false,
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
    hasSlices: false,
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
    hasSlices: false,
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
    hasSlices: true,
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
  ({ layer: fileLayer, availableLayers, deniedLayers, hasSlices }) => {
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
            { layer, path: `../../${layer}/foo/bar`, hasPathSlice: true },
            { layer, path: `../../${layer}/foo`, hasPathSlice: true },
            { layer, path: `../../${layer}`, hasPathSlice: false },
          ])
          .map(({ layer, path: importPath, hasPathSlice }) => ({
            settings: { fsd: { rootDir: '/src' } },
            filename: `/src/${fileLayer}/qux/quux.js`,
            code: `import foo from "${importPath}";`,
            errors: [
              layer === fileLayer && hasSlices && hasPathSlice
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
            { layer, path: `../${layer}/foo/bar`, hasPathSlice: true },
            { layer, path: `../${layer}/foo`, hasPathSlice: true },
            { layer, path: `../${layer}`, hasPathSlice: false },
          ])
          .map(({ layer, path: importPath, hasPathSlice }) => ({
            settings: { fsd: { rootDir: '/src' } },
            filename: `/src/${fileLayer}/qux.js`,
            code: `import foo from "${importPath}";`,
            errors: [
              layer === fileLayer && hasSlices && hasPathSlice
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
            { layer, path: `./${layer}/foo/bar` },
            { layer, path: `./${layer}/foo` },
            { layer, path: `./${layer}` },
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
