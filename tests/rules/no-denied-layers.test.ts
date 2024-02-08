import { noDeniedLayersRule } from '../../src/rules/no-denied-layers';
import { RuleTester } from 'eslint';

const tester = new RuleTester({
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
});

const joinLines = (...values: string[]) => values.join('\n');

describe('no-denied-layers', () => {
  describe.each([
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
      ],
    },
  ])('layer $layer', ({ layer, availableLayers }) => {
    tester.run('imports', noDeniedLayersRule, {
      valid: [
        {
          name: 'aliased imports should be allowed',
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
            'import bar0 from "@/qwe/foo/bar";',
            'import bar1 from "@scope/foo/bar";',
            'import bar2 from "next/foo/bar";',
          ),
        },
      ],
      invalid: [],
    });
  });
});
