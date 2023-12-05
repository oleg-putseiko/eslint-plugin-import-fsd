export type Layer = {
  name: string;
  actualNames: string[];
  deprecatedNames: string[];
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

export const getLayerNames = (layer: Layer): string[] =>
  layer.actualNames.concat(layer.deprecatedNames);
