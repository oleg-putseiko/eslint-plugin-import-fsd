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
};

type Layer = {
  name: string;
  index: number;
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

describe('extractImportContext', () => {
  it.each(INVALID_NODE_ITEMS)(
    'should return null if the node is $type',
    ({ node }) => {
      const pathContext: PathContext = {
        rootDir: '/src',
        fullPath: '/src/features/foo/bar',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {},
        packages: {},
      };

      expect(extractImportContext(node, pathContext)).toBeNull();
    },
  );

  describe.each(LAYERS)('$name layer', (layer) => {
    it('should detect segment data in a relative segment-level import path', () => {
      const pathContext: PathContext = {
        rootDir: '/src',
        fullPath: '/src/foo/bar/baz',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {},
        packages: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `../../${layer.name}/qux/quux` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'qux',
      });
    });

    it('should detect segment data in a relative slice-level import path', () => {
      const pathContext: PathContext = {
        rootDir: '/src',
        fullPath: '/src/foo/bar/baz',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {},
        packages: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `../../${layer.name}/qux` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'qux',
      });
    });

    it('should detect segment data in a relative layer-level import path', () => {
      const pathContext: PathContext = {
        rootDir: '/src',
        fullPath: '/src/foo/bar/baz',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {},
        packages: {},
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
        rootDir: '/src',
        fullPath: '/src/foo/bar/baz',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {
          '~/*': '../source/*',
          '@/*': './*',
          'qwe/*': '../qwe/*',
        },
        packages: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `@/${layer.name}/qux/quux` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'qux',
      });
    });

    it('should detect segment data in an aliased slice-level import path', () => {
      const pathContext: PathContext = {
        rootDir: '/src',
        fullPath: '/src/foo/bar/baz',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {
          '~/*': '../source/*',
          '@/*': './*',
          'qwe/*': '../qwe/*',
        },
        packages: {},
      };

      const node: ImportNode = {
        source: { type: 'Literal', value: `@/${layer.name}/qux` },
      };

      expect(extractImportContext(node, pathContext)).toEqual({
        layer: layer.name,
        layerIndex: layer.index,
        slice: 'qux',
      });
    });

    it('should detect segment data in an aliased layer-level import path', () => {
      const pathContext: PathContext = {
        rootDir: '/src',
        fullPath: '/src/foo/bar/baz',
        layer: 'features',
        layerIndex: 4,
        slice: 'foo',
        aliases: {
          '~/*': '../source/*',
          '@/*': './*',
          'qwe/*': '../qwe/*',
        },
        packages: {},
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
  });

  it('should not detect segment data in a relative root-level import path', () => {
    const pathContext: PathContext = {
      rootDir: '/src',
      fullPath: '/src/foo/bar/baz',
      layer: 'features',
      layerIndex: 4,
      slice: 'foo',
      aliases: {},
      packages: {},
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
