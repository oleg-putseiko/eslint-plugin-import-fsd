export type Layer = {
  names: string[];
  displayedActualNames: string[];
  deprecatedNames: string[];
};

export const LAYERS: Layer[] = [
  {
    names: ['app', 'apps', 'core', 'init'],
    deprecatedNames: ['core', 'init'],
    displayedActualNames: ['app'],
  },
  {
    names: ['process', 'processes', 'flow', 'flows', 'workflow', 'workflows'],
    deprecatedNames: [
      'process',
      'processes',
      'flow',
      'flows',
      'workflow',
      'workflows',
    ],
    displayedActualNames: ['app', 'features'],
  },
  {
    names: [
      'page',
      'pages',
      'screen',
      'screens',
      'view',
      'views',
      'layout',
      'layouts',
    ],
    deprecatedNames: [
      'screen',
      'screens',
      'view',
      'views',
      'layout',
      'layouts',
    ],
    displayedActualNames: ['pages'],
  },
  {
    names: ['widget', 'widgets'],
    deprecatedNames: [],
    displayedActualNames: ['widgets'],
  },
  {
    names: [
      'feature',
      'features',
      'component',
      'components',
      'container',
      'containers',
    ],
    deprecatedNames: ['component', 'components', 'container', 'containers'],
    displayedActualNames: ['features'],
  },
  {
    names: ['entity', 'entities', 'model', 'models'],
    deprecatedNames: ['model', 'models'],
    displayedActualNames: ['entities'],
  },
  {
    names: ['shared', 'common', 'lib', 'libs'],
    deprecatedNames: ['common', 'lib', 'libs'],
    displayedActualNames: ['shared'],
  },
];

export const listNames = (names: string[]): string =>
  names.reduce((acc, name, index) => {
    if (index <= 0) return `'${name}'`;
    if (index !== names.length - 1) return `${acc}, '${name}'`;
    return `${acc} or '${name}'`;
  }, '');
