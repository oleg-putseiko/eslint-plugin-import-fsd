import { RuleTester } from 'eslint';

import plugin from '../../src';

type TestItem = {
  layer: string;
  layersBelow: string[];
  deniedLayers: string[];
  hasSlices: boolean;
};

// prettier-ignore
const LAYER_GROUPS = [
  { name: 'app', items: ['app', 'apps', 'core', 'init'], hasSlices: false },
  { name: 'process', items: ['process', 'processes', 'flow', 'flows', 'workflow', 'workflows'], hasSlices: true },
  { name: 'page', items: ['page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts'], hasSlices: true },
  { name: 'widget', items: ['widget', 'widgets'], hasSlices: true },
  { name: 'feature', items: ['feature', 'features', 'component', 'components', 'container', 'containers'], hasSlices: true },
  { name: 'entity', items: ['entity', 'entities', 'model', 'models'], hasSlices: true },
  { name: 'shared', items: ['shared', 'common', 'lib', 'libs'], hasSlices: false },
];

const TEST_ITEMS: TestItem[] = LAYER_GROUPS.flatMap((group, index) => {
  const layersAbove = LAYER_GROUPS.slice(0, index).flatMap((g) => g.items);
  const layersBelow = LAYER_GROUPS.slice(index + 1).flatMap((g) => g.items);

  return group.items.map((layer) => ({
    layer,
    hasSlices: group.hasSlices,
    layersBelow: [...layersBelow, 'unknown-layer'],
    deniedLayers: layersAbove,
  }));
});

TEST_ITEMS.push({
  layer: 'unknown-layer',
  layersBelow: [...LAYER_GROUPS.flatMap((g) => g.items), 'other-unknown-layer'],
  deniedLayers: [],
  hasSlices: false,
});

const IMPORT_LEVELS = [
  {
    description: 'segment-level',
    prefix: '../../',
    getValidFilename: (layer: string) => `/src/${layer}/foo/bar.js`, // slice: 'foo'
    getInvalidFilename: (layer: string) => `/src/${layer}/qux/quux.js`, // slice: 'qux'
    hasFileSlice: true,
  },
  {
    description: 'slice-level',
    prefix: '../',
    getValidFilename: (layer: string) => `/src/${layer}/foo.js`, // slice: 'foo'
    getInvalidFilename: (layer: string) => `/src/${layer}/qux.js`, // slice: 'qux'
    hasFileSlice: true,
  },
  {
    description: 'layer-level',
    prefix: './',
    getValidFilename: (layer: string) => `/src/${layer}.js`, // no slice
    getInvalidFilename: (layer: string) => `/src/${layer}.js`, // no slice
    hasFileSlice: false,
  },
];

const tester = new RuleTester({
  languageOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
});

const noDeniedLayersRule = plugin.rules['no-denied-layers'];

const generatePaths = (prefix: string, importLayer: string) => [
  { path: `${prefix}${importLayer}/foo/bar`, hasPathSlice: true },
  { path: `${prefix}${importLayer}/foo`, hasPathSlice: true },
  { path: `${prefix}${importLayer}`, hasPathSlice: false },
];

describe.each(TEST_ITEMS)(
  '$layer layer',
  ({ layer: fileLayer, layersBelow, deniedLayers, hasSlices }) => {
    IMPORT_LEVELS.forEach(
      ({ description, prefix, getValidFilename, getInvalidFilename, hasFileSlice }) => {
        tester.run(
          `import from a ${description} file should be handled correctly`,
          noDeniedLayersRule,
          {
            valid: [
              // import from allowed layers
              ...layersBelow.flatMap((importLayer) =>
                generatePaths(prefix, importLayer).map(({ path }) => ({
                  settings: { fsd: { rootDir: '/src' } },
                  filename: getValidFilename(fileLayer),
                  code: `import foo from "${path}";`,
                })),
              ),

              // import from the same layer
              ...generatePaths(prefix, fileLayer)
                .filter(({ hasPathSlice }) => !hasSlices || (hasFileSlice && hasPathSlice))
                .map(({ path }) => ({
                  settings: { fsd: { rootDir: '/src' } },
                  filename: getValidFilename(fileLayer),
                  code: `import foo from "${path}";`,
                })),

              // import from ignored denied layers
              ...deniedLayers.flatMap((importLayer) =>
                generatePaths(prefix, importLayer).map(({ path }) => ({
                  settings: { fsd: { rootDir: '/src' } },
                  filename: getValidFilename(fileLayer),
                  options: [{ ignores: [importLayer] }],
                  code: `import foo from "${path}";`,
                })),
              ),
            ],

            invalid: [
              // import from denied layers
              ...deniedLayers.flatMap((importLayer) =>
                generatePaths(prefix, importLayer).map(({ path }) => ({
                  settings: { fsd: { rootDir: '/src' } },
                  filename: getValidFilename(fileLayer),
                  code: `import foo from "${path}";`,
                  errors: [
                    { messageId: 'deniedLayer', data: { fileLayer, deniedLayer: importLayer } },
                  ],
                })),
              ),

              // cross-slice import
              ...(hasSlices
                ? generatePaths(prefix, fileLayer).map(({ path, hasPathSlice }) => {
                    const isCrossSlice = hasFileSlice && hasPathSlice;

                    return {
                      settings: { fsd: { rootDir: '/src' } },
                      filename: getInvalidFilename(fileLayer),
                      code: `import foo from "${path}";`,
                      errors: [
                        isCrossSlice
                          ? {
                              messageId: 'deniedSlice',
                              data: { fileSlice: 'qux', deniedSlice: 'foo' },
                            }
                          : {
                              messageId: 'deniedLayer',
                              data: { fileLayer, deniedLayer: fileLayer },
                            },
                      ],
                    };
                  })
                : []),
            ],
          },
        );
      },
    );
  },
);
