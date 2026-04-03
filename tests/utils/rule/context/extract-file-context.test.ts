import { extractFileContext } from '../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractFileContext>[0];

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
  { names: ['qwe'], index: -1, hasSlices: true },
  { names: ['app', 'apps', 'core', 'init'], index: 0, hasSlices: false },
  { names: ['process', 'processes', 'flow', 'flows', 'workflow', 'workflows'], index: 1, hasSlices: true },
  { names: ['page', 'pages', 'screen', 'screens', 'view', 'views', 'layout', 'layouts'], index: 2, hasSlices: true },
  { names: ['widget', 'widgets'], index: 3, hasSlices: true },
  { names: ['feature', 'features', 'component', 'components', 'container', 'containers'], index: 4, hasSlices: true },
  { names: ['entity', 'entities', 'model', 'models'], index: 5, hasSlices: true },
  { names: ['shared', 'common', 'lib', 'libs'], index: 6, hasSlices: false },
];

const LAYERS: Layer[] = GROUPED_LAYERS.flatMap((layer) =>
  layer.names.map((name) => ({
    name,
    index: layer.index,
    hasSlices: layer.hasSlices,
  })),
);

const BASE_RULE_CONTEXT = {
  cwd: '/',
  filename: '/foo/bar.js',
  settings: {},
};

const EXPECTED_FALLBACK_CONTEXT = {
  cwd: '/',
  rootDir: '/',
  path: '/foo/bar.js',
  layer: 'foo',
  layerIndex: -1,
  slice: null,
  aliases: {},
  overrides: {},
};

describe('extractFileContext', () => {
  describe('validation errors (should return fallback context)', () => {
    it.each([
      { aliases: 0, type: 'falsy number' },
      { aliases: 123, type: 'truthy number' },
      { aliases: 123n, type: 'bigint' },
      { aliases: true, type: 'true' },
      { aliases: false, type: 'false' },
      { aliases: Symbol('sym'), type: 'symbol' },
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
    ])('if aliases is $type', ({ aliases }) => {
      const ruleContext: RuleContext = {
        ...BASE_RULE_CONTEXT,
        settings: { fsd: { aliases } },
      };
      expect(extractFileContext(ruleContext)).toEqual(EXPECTED_FALLBACK_CONTEXT);
    });

    it.each([
      { overrides: 0, type: 'falsy number' },
      { overrides: 123, type: 'truthy number' },
      { overrides: 123n, type: 'bigint' },
      { overrides: true, type: 'true' },
      { overrides: false, type: 'false' },
      { overrides: Symbol('sym'), type: 'symbol' },
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
    ])('if overrides is $type', ({ overrides }) => {
      const ruleContext: RuleContext = {
        ...BASE_RULE_CONTEXT,
        settings: { fsd: { overrides } },
      };
      expect(extractFileContext(ruleContext)).toEqual(EXPECTED_FALLBACK_CONTEXT);
    });
  });

  describe('property extraction', () => {
    it('path property should be the same as filename', () => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '/baz/qux',
        settings: { fsd: { rootDir: '/quux/quuux' } },
      };
      expect(extractFileContext(ruleContext)?.path).toBe('/baz/qux');
    });

    describe.each(LAYERS)('layer "$name"', (layer) => {
      it('should override file path with layer data', () => {
        const filename = '/foo/bar/baz.js';
        const overrides = { [filename]: { layer: layer.name, slice: 'qux' } };

        const ruleContext: RuleContext = {
          ...BASE_RULE_CONTEXT,
          filename,
          settings: { fsd: { overrides } },
        };

        expect(extractFileContext(ruleContext)).toEqual({
          cwd: '/',
          rootDir: '/',
          path: filename,
          layer: layer.name,
          layerIndex: layer.index,
          slice: layer.hasSlices && layer.index >= 0 ? 'qux' : null,
          aliases: {},
          overrides,
        });
      });

      it('should not match regexp special characters in an override pattern', () => {
        const filename = '^()[]{}\\d\\.|?foo+$';
        const overrides = {
          '^()[]{}\\d\\.|?*+$': { layer: layer.name, slice: 'bar' },
        };

        const ruleContext: RuleContext = {
          ...BASE_RULE_CONTEXT,
          filename,
          settings: { fsd: { overrides } },
        };

        expect(extractFileContext(ruleContext)).toEqual({
          cwd: '/',
          rootDir: '/',
          path: filename,
          layer: layer.name,
          layerIndex: layer.index,
          slice: layer.hasSlices && layer.index >= 0 ? 'bar' : null,
          aliases: {},
          overrides,
        });
      });
    });
  });

  describe('rootDir resolution', () => {
    it.each([
      { rootDir: null, type: 'null' },
      { rootDir: undefined, type: 'undefined' },
      { rootDir: 0, type: 'falsy number' },
      { rootDir: 123, type: 'truthy number' },
      { rootDir: 123n, type: 'bigint' },
      { rootDir: true, type: 'true' },
      { rootDir: false, type: 'false' },
      { rootDir: Symbol('sym'), type: 'symbol' },
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
        expect(extractFileContext(ruleContext)?.rootDir).toBe('/foo/bar');
      },
    );

    it('rootDir property should be equal to cwd if settings are empty', () => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '',
        settings: {},
      };
      expect(extractFileContext(ruleContext)?.rootDir).toBe('/foo/bar');
    });

    it('rootDir property should be equal to rootDir from settings', () => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '',
        settings: { fsd: { rootDir: '/baz/qux' } },
      };
      expect(extractFileContext(ruleContext)?.rootDir).toBe('/baz/qux');
    });

    it('rootDir property should be resolved based on cwd', () => {
      const ruleContext: RuleContext = {
        cwd: '/foo',
        filename: '',
        settings: { fsd: { rootDir: './bar' } },
      };
      expect(extractFileContext(ruleContext)?.rootDir).toBe('/foo/bar');
    });
  });
});
