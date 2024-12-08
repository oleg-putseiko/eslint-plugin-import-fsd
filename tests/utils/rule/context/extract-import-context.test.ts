import { extractImportContext } from '../../../../src/utils/rule/context';

type ImportNode = Parameters<typeof extractImportContext>[0];
type PathContext = Parameters<typeof extractImportContext>[1];
type ImportContext = ReturnType<typeof extractImportContext>;

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

describe('extractImportContext', () => {
  it.each(INVALID_NODE_ITEMS)(
    'should return null if the node is $type',
    ({ node }) => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {},
        overrides: {},
      };

      expect(extractImportContext(node, pathContext)).toBeNull();
    },
  );

  describe.each(LAYERS)('$name layer', (layer) => {
    it('should detect segment data in a relative segment-level import path', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {},
        overrides: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `../../${layer.name}/qux/quux` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices ? 'qux' : null,
      });
    });

    it('should detect segment data in a relative slice-level import path', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {},
        overrides: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `../../${layer.name}/qux` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices ? 'qux' : null,
      });
    });

    it('should detect segment data in a relative layer-level import path', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {},
        overrides: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `../../${layer.name}` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: null,
      });
    });

    it('should detect segment data in an aliased segment-level import path', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {
          '~/*': './source/*',
          '@/*': './src/*',
          'qwe/*': './qwe/*',
        },
        overrides: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `@/${layer.name}/qux/quux` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices ? 'qux' : null,
      });
    });

    it('should detect segment data in an aliased slice-level import path', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {
          '~/*': './source/*',
          '@/*': './src/*',
          'qwe/*': './qwe/*',
        },
        overrides: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `@/${layer.name}/qux` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices ? 'qux' : null,
      });
    });

    it('should detect segment data in an aliased layer-level import path', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {
          '~/*': './source/*',
          '@/*': './src/*',
          'qwe/*': './qwe/*',
        },
        overrides: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `@/${layer.name}` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: null,
      });
    });

    it('should override import path data', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {},
        overrides: {
          '@foo/bar': { layer: layer.name, slice: 'baz' },
        },
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `@foo/bar` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices ? 'baz' : null,
      });
    });

    it('should override aliased import path data', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {
          qwe: '/src/entities/baz/qux.js',
        },
        overrides: {
          '/src/entities/baz/qux.js': { layer: layer.name, slice: 'quux' },
        },
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: 'qwe' },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices ? 'quux' : null,
      });
    });

    it('should override import template path data', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {
          '@/*': './src/*',
        },
        overrides: {
          '@foo/*': { layer: layer.name, slice: 'baz' },
        },
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `@foo/bar` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices ? 'baz' : null,
      });
    });

    it('should not match regexp special characters in an alias pattern', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {
          '^()[]{}\\d\\.|?*+$': `/src/${layer.name}/*`,
        },
        overrides: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `^()[]{}\\d\\.|?qux+$` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices ? 'qux' : null,
      });
    });

    it('should not match regexp special characters in an override pattern', () => {
      const pathContext: PathContext = {
        cwd: '/',
        rootDir: '/src',
        fullPath: '/src/features/foo/bar.js',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {},
        overrides: {
          '^()[]{}\\d\\.|?*+$': { layer: layer.name, slice: 'quux' },
        },
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `^()[]{}\\d\\.|?qux+$` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: layer.hasSlices ? 'quux' : null,
      });
    });
  });

  it('should not detect segment data in a relative root-level import path', () => {
    const pathContext: PathContext = {
      cwd: '/',
      rootDir: '/src',
      fullPath: '/src/features/foo/bar.js',
      layer: 'features',
      layerIndex: 4,
      slice: 'foo',
      aliases: {},
      overrides: {},
    };

    const node: ImportNode = {
      source: { type: 'Literal', value: '../../' },
    };

    const expectedResult: ImportContext = {
      layer: null,
      layerIndex: -1,
      slice: null,
    };

    expect(extractImportContext(node, pathContext)).toEqual(expectedResult);
  });
});
