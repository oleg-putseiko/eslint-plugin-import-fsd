/** Name pattern compatible with Glob, RegExp and gitignore syntax */
type NamePattern = string;

export type Layer = {
  name: string;
  actualNames: NamePattern[];
  deprecatedNames: NamePattern[];
};

export const LAYERS: Layer[] = [
  {
    name: 'app',
    actualNames: ['app', 'apps'],
    deprecatedNames: ['core', 'init'],
  },
  {
    name: 'processes',
    actualNames: ['process', 'processes'],
    deprecatedNames: ['flow', 'flows', 'workflow', 'workflows'],
  },
  {
    name: 'pages',
    actualNames: ['page', 'pages'],
    deprecatedNames: [
      'screen',
      'screens',
      'view',
      'views',
      'layout',
      'layouts',
    ],
  },
  {
    name: 'widgets',
    actualNames: ['widget', 'widgets'],
    deprecatedNames: [],
  },
  {
    name: 'features',
    actualNames: ['feature', 'features'],
    deprecatedNames: ['component', 'components', 'container', 'containers'],
  },
  {
    name: 'entities',
    actualNames: ['entity', 'entities'],
    deprecatedNames: ['model', 'models'],
  },
  {
    name: 'shared',
    actualNames: ['shared'],
    deprecatedNames: ['common', 'lib', 'libs'],
  },
];

export const DEPRECATED_PATH_GROUP: string[] = LAYERS.flatMap((layer) =>
  layer.deprecatedNames.flatMap((layerName) => [
    `src/${layerName}/**/*`,
    `@/${layerName}/**/*`,
    `@${layerName}/**/*`,
    `${layerName}/**/*`,
  ]),
);

export const BREAKING_PATH_GROUP: string[] = ['/', './', '../'];

export const getLayerNames = (layer: Layer): NamePattern[] =>
  layer.actualNames.concat(layer.deprecatedNames);
