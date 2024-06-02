import { extractPathContext } from '../../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractPathContext>[0];
type PathContext = ReturnType<typeof extractPathContext>;

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
  { names: ['qwe'], index: -1 },
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

describe('segment context properties', () => {
  describe.each(LAYERS)('$name layer', (layer) => {
    it('should detect segment data in a segment-level path with rootDir passed through cwd', () => {
      const ruleContext: RuleContext = {
        cwd: '/',
        filename: `/${layer.name}/foo/bar`,
        settings: {},
      };

      const expected: PathContext = {
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'foo',
        cwd: '/',
        rootDir: '/',
        fullPath: `/${layer.name}/foo/bar`,
        aliases: {},
        overrides: {},
      };

      expect(extractPathContext(ruleContext)).toEqual(expected);
    });

    it('should detect segment data in a slice-level path with rootDir passed through cwd', () => {
      const ruleContext: RuleContext = {
        cwd: '/',
        filename: `/${layer.name}/foo`,
        settings: {},
      };

      const expected: PathContext = {
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'foo',
        cwd: '/',
        rootDir: '/',
        fullPath: `/${layer.name}/foo`,
        aliases: {},
        overrides: {},
      };

      expect(extractPathContext(ruleContext)).toEqual(expected);
    });

    it('should detect segment data in a layer-level path with rootDir passed through cwd', () => {
      const ruleContext: RuleContext = {
        cwd: '/',
        filename: `/${layer.name}`,
        settings: {},
      };

      const expected: PathContext = {
        layer: layer.name,
        layerIndex: layer.index,
        slice: null,
        cwd: '/',
        rootDir: '/',
        fullPath: `/${layer.name}`,
        aliases: {},
        overrides: {},
      };

      expect(extractPathContext(ruleContext)).toEqual(expected);
    });

    it('should detect segment data in a segment-level path with rootDir passed through settings', () => {
      const ruleContext: RuleContext = {
        cwd: '/',
        filename: `/src/${layer.name}/foo/bar`,
        settings: { fsd: { rootDir: '/src' } },
      };

      const expected: PathContext = {
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'foo',
        cwd: '/',
        rootDir: '/src',
        fullPath: `/src/${layer.name}/foo/bar`,
        aliases: {},
        overrides: {},
      };

      expect(extractPathContext(ruleContext)).toEqual(expected);
    });

    it('should detect segment data in a slice-level path with rootDir passed through settings', () => {
      const ruleContext: RuleContext = {
        cwd: '/',
        filename: `/src/${layer.name}/foo`,
        settings: { fsd: { rootDir: '/src' } },
      };

      const expected: PathContext = {
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'foo',
        cwd: '/',
        rootDir: '/src',
        fullPath: `/src/${layer.name}/foo`,
        aliases: {},
        overrides: {},
      };

      expect(extractPathContext(ruleContext)).toEqual(expected);
    });

    it('should detect segment data in a layer-level path with rootDir passed through settings', () => {
      const ruleContext: RuleContext = {
        cwd: '/',
        filename: `/src/${layer.name}`,
        settings: { fsd: { rootDir: '/src' } },
      };

      const expected: PathContext = {
        layer: layer.name,
        layerIndex: layer.index,
        slice: null,
        cwd: '/',
        rootDir: '/src',
        fullPath: `/src/${layer.name}`,
        aliases: {},
        overrides: {},
      };

      expect(extractPathContext(ruleContext)).toEqual(expected);
    });
  });

  it('should not detect segment data in a root path with rootDir passed through cwd', () => {
    const ruleContext: RuleContext = {
      cwd: '/',
      filename: '/',
      settings: {},
    };

    const expected: PathContext = {
      layer: null,
      layerIndex: -1,
      slice: null,
      cwd: '/',
      rootDir: '/',
      fullPath: '/',
      aliases: {},
      overrides: {},
    };

    expect(extractPathContext(ruleContext)).toEqual(expected);
  });

  it('should not detect segment data in a path outside a root directory with rootDir passed through cwd', () => {
    const ruleContext: RuleContext = {
      cwd: '/src',
      filename: '/sources',
      settings: {},
    };

    const expected: PathContext = {
      layer: null,
      layerIndex: -1,
      slice: null,
      cwd: '/src',
      rootDir: '/src',
      fullPath: '/sources',
      aliases: {},
      overrides: {},
    };

    expect(extractPathContext(ruleContext)).toEqual(expected);
  });

  it('should not detect segment data in a root path with rootDir passed through settings', () => {
    const ruleContext: RuleContext = {
      cwd: '/',
      filename: '/src',
      settings: { fsd: { rootDir: '/src' } },
    };

    const expected: PathContext = {
      layer: null,
      layerIndex: -1,
      slice: null,
      cwd: '/',
      rootDir: '/src',
      fullPath: '/src',
      aliases: {},
      overrides: {},
    };

    expect(extractPathContext(ruleContext)).toEqual(expected);
  });

  it('should not detect segment data in a path outside a root directory with rootDir passed through settings', () => {
    const ruleContext: RuleContext = {
      cwd: '/',
      filename: '/sources',
      settings: { fsd: { rootDir: '/src' } },
    };

    const expected: PathContext = {
      layer: null,
      layerIndex: -1,
      slice: null,
      cwd: '/',
      rootDir: '/src',
      fullPath: '/sources',
      aliases: {},
      overrides: {},
    };

    expect(extractPathContext(ruleContext)).toEqual(expected);
  });
});
