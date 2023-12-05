/**
 * @typedef { string } NamePattern Name pattern compatible with Glob, RegExp and gitignore syntax
 * @typedef { { name: string; actualNames: NamePattern[]; deprecatedNames: NamePattern[] } } Layer
 *
 * @type { Layer[] }
 */
const LAYERS = [
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

const DEPRECATED_PATH_GROUP = LAYERS.flatMap((layer) =>
  layer.deprecatedNames.flatMap((layerName) => [
    `src/${layerName}/**/*`,
    `@/${layerName}/**/*`,
    `@${layerName}/**/*`,
    `${layerName}/**/*`,
  ]),
);

const BREAKING_PATH_GROUP = ['/', './', '../'];

/**
 * @param { import('./layers').Layer } layer
 *
 * @returns { NamePattern[] } Layer name patterns
 */
const getLayerNames = (layer) =>
  layer.actualNames.concat(layer.deprecatedNames);

module.exports = {
  LAYERS,
  DEPRECATED_PATH_GROUP,
  BREAKING_PATH_GROUP,
  getLayerNames,
};
