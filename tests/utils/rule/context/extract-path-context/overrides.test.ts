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

describe('overrides context property', () => {
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
      slice: 'qux',
      aliases: {},
      overrides: {
        '/foo/bar/baz.js': { layer: layer.name, slice: 'qux' },
      },
    };

    expect(extractPathContext(ruleContext)).toEqual(expected);
  });
});
