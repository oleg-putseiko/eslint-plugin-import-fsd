import { noDeniedLayersRule } from '../../src/rules/no-denied-layers';
import { RuleTester } from 'eslint';

type TestItem = {
  layer: string;
  availableLayers: string[];
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
  },
];

const tester = new RuleTester({
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
});

const joinLines = (...values: string[]) => values.join('\n');

describe('no-denied-layers', () => {
  describe.each(TEST_ITEMS)('layer $layer', ({ layer, availableLayers }) => {
    tester.run('aliased imports', noDeniedLayersRule, {
      valid: [
        // Aliased segment-level imports
        {
          name: 'segment-level imports should be allowed',
          settings: {
            fsd: {
              rootDir: '/users/user/projects/plugin-tests/src',
              aliases: {
                '@/*': './*',
              },
            },
          },
          filename: `/users/user/projects/plugin-tests/src/${layer}/foo/bar.js`,
          code: joinLines(
            ...availableLayers.map<string>(
              (availableLayer, index) =>
                `import foo${index} from "@/${availableLayer}/foo/bar";`,
            ),
            'import bar0 from "@scope/foo/bar";',
            'import bar1 from "next/foo/bar";',
          ),
        },

        // Aliased slice-level imports
        {
          name: 'slice-level imports should be allowed',
          settings: {
            fsd: {
              rootDir: '/users/user/projects/plugin-tests/src',
              aliases: {
                '@/*': './*',
              },
            },
          },
          filename: `/users/user/projects/plugin-tests/src/${layer}/foo/bar.js`,
          code: joinLines(
            ...availableLayers.map<string>(
              (availableLayer, index) =>
                `import foo${index} from "@/${availableLayer}/foo";`,
            ),
            'import bar0 from "@scope/foo";',
            'import bar1 from "next/foo";',
          ),
        },

        // Aliased layer-level imports
        {
          name: 'aliased layer-level imports should be allowed',
          settings: {
            fsd: {
              rootDir: '/users/user/projects/plugin-tests/src',
              aliases: {
                '@/*': './*',
              },
            },
          },
          filename: `/users/user/projects/plugin-tests/src/${layer}/foo/bar.js`,
          code: joinLines(
            ...availableLayers.map<string>(
              (availableLayer, index) =>
                `import foo${index} from "@/${availableLayer}";`,
            ),
            'import bar0 from "@scope";',
            'import bar1 from "next";',
          ),
        },
      ],
      invalid: [],
    });
  });
});
