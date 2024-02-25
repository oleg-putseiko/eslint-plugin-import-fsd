import { extractPathContext } from '../../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractPathContext>[0];

type GroupedLayer = {
  names: string[];
  index: number;
};

type Layer = {
  name: string;
  index: number;
};

// prettier-ignore
const GROUPED_LAYERS: GroupedLayer[] = [
  { names: ['app', 'apps', 'core', 'init'], index: 0 },
  { names: ['process', 'processes', 'flow', 'flows', 'workflow', 'workflows'], index: 1 },
  { names: ['page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts'], index: 2 },
  { names: ['widget', 'widgets'], index: 3 },
  { names: ['feature', 'features', 'component', 'components', 'container', 'containers'], index: 4 },
  { names: ['entity', 'entities', 'model', 'models'], index: 5 },
  { names: ['shared', 'common', 'lib', 'libs'], index: 6 },
];

const LAYERS: Layer[] = GROUPED_LAYERS.flatMap((layer) =>
  layer.names.map((name) => ({ name, index: layer.index })),
);

describe('layer, slice and layerIndex context properties', () => {
  describe.each(LAYERS)('$name layer', (layer) => {
    it('should detect segment data in a segment-level path with rootDir passed through cwd', () => {
      const ruleContext: RuleContext = {
        cwd: '/user/project/src',
        filename: `/user/project/src/${layer.name}/foo/bar`,
        settings: {},
      };

      expect(extractPathContext(ruleContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'foo',
        rootDir: '/user/project/src',
        fullPath: `/user/project/src/${layer.name}/foo/bar`,
        aliases: {},
        packages: {},
      });
    });

    it('should detect segment data in a slice-level path with rootDir passed through cwd', () => {
      const ruleContext: RuleContext = {
        cwd: '/user/project/src',
        filename: `/user/project/src/${layer.name}/foo`,
        settings: {},
      };

      expect(extractPathContext(ruleContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'foo',
        rootDir: '/user/project/src',
        fullPath: `/user/project/src/${layer.name}/foo`,
        aliases: {},
        packages: {},
      });
    });

    it('should detect segment data in a layer-level path with rootDir passed through cwd', () => {
      const ruleContext: RuleContext = {
        cwd: '/user/project/src',
        filename: `/user/project/src/${layer.name}`,
        settings: {},
      };

      expect(extractPathContext(ruleContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: null,
        rootDir: '/user/project/src',
        fullPath: `/user/project/src/${layer.name}`,
        aliases: {},
        packages: {},
      });
    });

    it('should not detect segment data in a root path with rootDir passed through cwd', () => {
      const ruleContext: RuleContext = {
        cwd: '/user/project/src',
        filename: '/user/project/src',
        settings: {},
      };

      expect(extractPathContext(ruleContext)).toEqual({
        layer: null,
        layerIndex: -1,
        slice: null,
        rootDir: '/user/project/src',
        fullPath: '/user/project/src',
        aliases: {},
        packages: {},
      });
    });

    it('should not detect segment data in a path outside a root directory with rootDir passed through cwd', () => {
      const ruleContext: RuleContext = {
        cwd: '/user/project/src',
        filename: '/user/project/sources',
        settings: {},
      };

      expect(extractPathContext(ruleContext)).toEqual({
        layer: null,
        layerIndex: -1,
        slice: null,
        rootDir: '/user/project/src',
        fullPath: '/user/project/sources',
        aliases: {},
        packages: {},
      });
    });

    it('should detect segment data in a segment-level path with rootDir passed through settings', () => {
      const ruleContext: RuleContext = {
        cwd: '/qwe',
        filename: `/user/project/src/${layer.name}/foo/bar`,
        settings: { fsd: { rootDir: '/user/project/src' } },
      };

      expect(extractPathContext(ruleContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'foo',
        rootDir: '/user/project/src',
        fullPath: `/user/project/src/${layer.name}/foo/bar`,
        aliases: {},
        packages: {},
      });
    });

    it('should detect segment data in a slice-level path with rootDir passed through settings', () => {
      const ruleContext: RuleContext = {
        cwd: '/qwe',
        filename: `/user/project/src/${layer.name}/foo`,
        settings: { fsd: { rootDir: '/user/project/src' } },
      };

      expect(extractPathContext(ruleContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'foo',
        rootDir: '/user/project/src',
        fullPath: `/user/project/src/${layer.name}/foo`,
        aliases: {},
        packages: {},
      });
    });

    it('should detect segment data in a layer-level path with rootDir passed through settings', () => {
      const ruleContext: RuleContext = {
        cwd: '/qwe',
        filename: `/user/project/src/${layer.name}`,
        settings: { fsd: { rootDir: '/user/project/src' } },
      };

      expect(extractPathContext(ruleContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: null,
        rootDir: '/user/project/src',
        fullPath: `/user/project/src/${layer.name}`,
        aliases: {},
        packages: {},
      });
    });

    it('should not detect segment data in a root path with rootDir passed through settings', () => {
      const ruleContext: RuleContext = {
        cwd: '/qwe',
        filename: '/user/project/src',
        settings: { fsd: { rootDir: '/user/project/src' } },
      };

      expect(extractPathContext(ruleContext)).toEqual({
        layer: null,
        layerIndex: -1,
        slice: null,
        rootDir: '/user/project/src',
        fullPath: '/user/project/src',
        aliases: {},
        packages: {},
      });
    });

    it('should not detect segment data in a path outside a root directory with rootDir passed through settings', () => {
      const ruleContext: RuleContext = {
        cwd: '/qwe',
        filename: '/user/project/sources',
        settings: { fsd: { rootDir: '/user/project/src' } },
      };

      expect(extractPathContext(ruleContext)).toEqual({
        layer: null,
        layerIndex: -1,
        slice: null,
        rootDir: '/user/project/src',
        fullPath: '/user/project/sources',
        aliases: {},
        packages: {},
      });
    });
  });
});
