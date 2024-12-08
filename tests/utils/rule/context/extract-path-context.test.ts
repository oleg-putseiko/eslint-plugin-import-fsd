import { extractPathContext } from '../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractPathContext>[0];
type PathContext = ReturnType<typeof extractPathContext>;

type GroupedLayer = {
  names: string[];
  index: number;
  hasSlices: boolean;
};

type Layer = {
  name: string;
  index: number;
  hasSlices: boolean;
};

// prettier-ignore
const GROUPED_LAYERS: GroupedLayer[] = [
  { 
    names: ['qwe'], 
    index: -1, 
    hasSlices: true,
  },
  { 
    names: ['app', 'apps', 'core', 'init'], 
    index: 0, 
    hasSlices: false,
  },
  { 
    names: ['process', 'processes', 'flow', 'flows', 'workflow', 'workflows'], 
    index: 1, 
    hasSlices: true,
  },
  { 
    names: ['page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts'], 
    index: 2, 
    hasSlices: true,
  },
  { 
    names: ['widget', 'widgets'], 
    index: 3, 
    hasSlices: true,
  },
  { 
    names: ['feature', 'features', 'component', 'components', 'container', 'containers'], 
    index: 4, 
    hasSlices: true,
  },
  { 
    names: ['entity', 'entities', 'model', 'models'], 
    index: 5, 
    hasSlices: true,
  },
  { 
    names: ['shared', 'common', 'lib', 'libs'], 
    index: 6, 
    hasSlices: false,
  },
];

const LAYERS: Layer[] = GROUPED_LAYERS.flatMap((layer) =>
  layer.names.map((name) => ({
    name,
    index: layer.index,
    hasSlices: layer.hasSlices,
  })),
);

describe('extractPathContext', () => {
  it.each([
    { aliases: 0, type: 'falsy number' },
    { aliases: 123, type: 'truthy number' },
    { aliases: 123n, type: 'bigint' },
    { aliases: true, type: 'true' },
    { aliases: false, type: 'false' },
    { aliases: Symbol(), type: 'symbol' },
    { aliases: () => 'fooBar', type: 'function' },
    { aliases: [], type: 'array' },
    {
      aliases: {
        '@/src/*': {},
        '~/src/*': 123,
        '*': true,
        '': undefined,
        fooBar: 'baz-qux',
      },
      type: 'object with non-string replacements',
    },
  ])('context should be null if the aliases is $type', ({ aliases }) => {
    const ruleContext: RuleContext = {
      cwd: '/',
      filename: '/foo/bar.js',
      settings: { fsd: { aliases } },
    };

    expect(extractPathContext(ruleContext)).toBeNull();
  });

  it.each([
    { overrides: 0, type: 'falsy number' },
    { overrides: 123, type: 'truthy number' },
    { overrides: 123n, type: 'bigint' },
    { overrides: true, type: 'true' },
    { overrides: false, type: 'false' },
    { overrides: Symbol(), type: 'symbol' },
    { overrides: () => 'fooBar', type: 'function' },
    { overrides: [{ layer: 'foo', slice: 'bar' }], type: 'array' },
    {
      overrides: { fooBar: { layer: 'foo' } },
      type: 'object without slice segment',
    },
    {
      overrides: { fooBar: { slice: 'foo' } },
      type: 'object without layer segment',
    },
  ])(
    'path context should be null if the overrides is $type',
    ({ overrides }) => {
      const ruleContext: RuleContext = {
        cwd: '/',
        filename: '/foo/bar.js',
        settings: { fsd: { overrides } },
      };

      expect(extractPathContext(ruleContext)).toBeNull();
    },
  );

  it('fullPath property should be the same as filename', () => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '/baz/qux',
      settings: { fsd: { rootDir: '/quux/quuux' } },
    };

    expect(extractPathContext(ruleContext)?.fullPath).toBe('/baz/qux');
  });

  it.each(LAYERS)('should override file path with "%s" layer data', (layer) => {
    const ruleContext: RuleContext = {
      cwd: '/',
      filename: '/foo/bar/baz.js',
      settings: {
        fsd: {
          overrides: {
            '/foo/bar/baz.js': { layer: layer.name, slice: 'qux' },
          },
        },
      },
    };

    const expected: PathContext = {
      cwd: '/',
      rootDir: '/',
      fullPath: `/foo/bar/baz.js`,
      layer: layer.name,
      layerIndex: layer.index,
      slice: layer.hasSlices ? 'qux' : null,
      aliases: {},
      overrides: {
        '/foo/bar/baz.js': { layer: layer.name, slice: 'qux' },
      },
    };

    expect(extractPathContext(ruleContext)).toEqual(expected);
  });

  it.each(LAYERS)(
    'should not match regexp special characters in an override pattern by the "$name" layer',
    (layer) => {
      const ruleContext: RuleContext = {
        cwd: '/',
        filename: '^()[]{}\\d\\.|?foo+$',
        settings: {
          fsd: {
            overrides: {
              '^()[]{}\\d\\.|?*+$': { layer: layer.name, slice: 'bar' },
            },
          },
        },
      };

      const expected: PathContext = {
        cwd: '/',
        rootDir: '/',
        fullPath: '^()[]{}\\d\\.|?foo+$',
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices ? 'bar' : null,
        aliases: {},
        overrides: {
          '^()[]{}\\d\\.|?*+$': { layer: layer.name, slice: 'bar' },
        },
      };

      expect(extractPathContext(ruleContext)).toEqual(expected);
    },
  );

  it.each([
    { rootDir: null, type: 'null' },
    { rootDir: undefined, type: 'undefined' },
    { rootDir: 0, type: 'falsy number' },
    { rootDir: 123, type: 'truthy number' },
    { rootDir: 123n, type: 'bigint' },
    { rootDir: true, type: 'true' },
    { rootDir: false, type: 'false' },
    { rootDir: Symbol(), type: 'symbol' },
    { rootDir: () => 'fooBar', type: 'function' },
    { rootDir: {}, type: 'object' },
    { rootDir: ['foo', 'bar'], type: 'array' },
  ])(
    'should give priority to cwd over rootDir from settings if rootDir is $type',
    ({ rootDir }) => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '',
        settings: { fsd: { rootDir } },
      };

      expect(extractPathContext(ruleContext)?.rootDir).toBe('/foo/bar');
    },
  );

  it('rootDir property should be equal to cwd', () => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '',
      settings: {},
    };

    expect(extractPathContext(ruleContext)?.rootDir).toBe('/foo/bar');
  });

  it('rootDir property should be equal to rootDir from settings', () => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '',
      settings: { fsd: { rootDir: '/baz/qux' } },
    };

    expect(extractPathContext(ruleContext)?.rootDir).toBe('/baz/qux');
  });

  it('rootDir property should be resolved based on cwd', () => {
    const ruleContext: RuleContext = {
      cwd: '/foo',
      filename: '',
      settings: { fsd: { rootDir: './bar' } },
    };

    expect(extractPathContext(ruleContext)?.rootDir).toBe('/foo/bar');
  });
});
