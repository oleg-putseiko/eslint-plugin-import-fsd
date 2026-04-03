import { extractImportContext } from '../../../../src/utils/rule/context';

type ImportNode = Parameters<typeof extractImportContext>[0];
type PathContext = Parameters<typeof extractImportContext>[1];

type NodeItem = {
  node: ImportNode;
  type: string;
};

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
const INVALID_NODE_ITEMS: NodeItem[] = [
  { node: { source: { type: 'Literal', value: true } }, type: 'true' },
  { node: { source: { type: 'Literal', value: false } }, type: 'false' },
  { node: { source: { type: 'Literal', value: 123 } }, type: 'number' },
  { node: { source: { type: 'Literal', value: undefined, bigint: '123n' } }, type: 'number' },
  { node: { source: { type: 'Literal', value: undefined, regex: { pattern: '.*', flags: 'u' } } }, type: 'regex' },
  { node: { source: { type: 'Literal', value: null } }, type: 'null' },
];

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

const BASE_CONTEXT: PathContext = {
  cwd: '/',
  rootDir: '/src',
  path: '/src/features/foo/bar.js',
  layer: 'features',
  layerIndex: 4,
  slice: 'foo',
  aliases: {},
  overrides: {},
};

const COMMON_ALIASES = {
  '~/*': './source/*',
  '@/*': './src/*',
  'qwe/*': './qwe/*',
};

const PATH_LEVELS = [
  {
    type: 'segment-level',
    suffix: '/qux/quux',
    getExpectedSlice: (hasSlices: boolean, index: number) =>
      hasSlices && index >= 0 ? 'qux' : null,
  },
  {
    type: 'slice-level',
    suffix: '/qux',
    getExpectedSlice: (hasSlices: boolean, index: number) =>
      hasSlices && index >= 0 ? 'qux' : null,
  },
  {
    type: 'layer-level',
    suffix: '',
    getExpectedSlice: () => null,
  },
];

describe('extractImportContext', () => {
  it.each(INVALID_NODE_ITEMS)('should return null if the node is $type', ({ node }) => {
    expect(extractImportContext(node, BASE_CONTEXT)).toBeNull();
  });

  describe.each(LAYERS)('$name layer', (layer) => {
    // 1. Related and aliased paths
    describe.each(PATH_LEVELS)('with $type import path', ({ suffix, getExpectedSlice }) => {
      it(`should detect segment data in a relative path`, () => {
        const node: ImportNode = {
          source: { type: 'Literal', value: `../../${layer.name}${suffix}` },
        };
        expect(extractImportContext(node, BASE_CONTEXT)).toEqual({
          layer: layer.name,
          layerIndex: layer.index,
          slice: getExpectedSlice(layer.hasSlices, layer.index), // Передаем индекс
        });
      });

      it(`should detect segment data in an aliased path`, () => {
        const pathContext = { ...BASE_CONTEXT, aliases: COMMON_ALIASES };
        const node: ImportNode = {
          source: { type: 'Literal', value: `@/${layer.name}${suffix}` },
        };

        expect(extractImportContext(node, pathContext)).toEqual({
          layer: layer.name,
          layerIndex: layer.index,
          slice: getExpectedSlice(layer.hasSlices, layer.index), // Передаем индекс
        });
      });
    });

    // 2. Overrides
    it('should override import path data', () => {
      const pathContext: PathContext = {
        ...BASE_CONTEXT,
        overrides: { '@foo/bar': { layer: layer.name, slice: 'baz' } },
      };
      const node: ImportNode = {
        source: { type: 'Literal', value: `@foo/bar` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices && layer.index >= 0 ? 'baz' : null,
      });
    });

    it('should override aliased import path data', () => {
      const pathContext: PathContext = {
        ...BASE_CONTEXT,
        aliases: { qwe: '/src/entities/baz/qux.js' },
        overrides: {
          '/src/entities/baz/qux.js': { layer: layer.name, slice: 'quux' },
        },
      };
      const node: ImportNode = { source: { type: 'Literal', value: 'qwe' } };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices && layer.index >= 0 ? 'quux' : null,
      });
    });

    it('should override import template path data', () => {
      const pathContext: PathContext = {
        ...BASE_CONTEXT,
        aliases: { '@/*': './src/*' },
        overrides: { '@foo/*': { layer: layer.name, slice: 'baz' } },
      };
      const node: ImportNode = {
        source: { type: 'Literal', value: `@foo/bar` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices && layer.index >= 0 ? 'baz' : null,
      });
    });

    // 3. RegExp special characters
    it('should not match regexp special characters in an alias pattern', () => {
      const pathContext: PathContext = {
        ...BASE_CONTEXT,
        aliases: { '^()[]{}\\d\\.|?*+$': `/src/${layer.name}/*` },
      };
      const node: ImportNode = {
        source: { type: 'Literal', value: `^()[]{}\\d\\.|?qux+$` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices && layer.index >= 0 ? 'qux' : null,
      });
    });

    it('should not match regexp special characters in an override pattern', () => {
      const pathContext: PathContext = {
        ...BASE_CONTEXT,
        overrides: { '^()[]{}\\d\\.|?*+$': { layer: layer.name, slice: 'quux' } },
      };
      const node: ImportNode = {
        source: { type: 'Literal', value: `^()[]{}\\d\\.|?qux+$` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices && layer.index >= 0 ? 'quux' : null,
      });
    });
  });

  it('should not detect segment data in a relative root-level import path', () => {
    const node: ImportNode = { source: { type: 'Literal', value: '../../' } };

    expect(extractImportContext(node, BASE_CONTEXT)).toEqual({
      layer: null,
      layerIndex: -1,
      slice: null,
    });
  });
});
