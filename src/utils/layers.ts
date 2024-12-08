export type Layer = {
  names: string[];
  displayedActualNames: string[];
  deprecatedNames: string[];
  hasSlices: boolean;
};

export const LAYERS: Layer[] = [
  {
    names: ['app', 'apps', 'core', 'init'],
    deprecatedNames: ['core', 'init'],
    displayedActualNames: ['app'],
    hasSlices: false,
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
    hasSlices: true,
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
    hasSlices: true,
  },
  {
    names: ['widget', 'widgets'],
    deprecatedNames: [],
    displayedActualNames: ['widgets'],
    hasSlices: true,
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
    hasSlices: true,
  },
  {
    names: ['entity', 'entities', 'model', 'models'],
    deprecatedNames: ['model', 'models'],
    displayedActualNames: ['entities'],
    hasSlices: true,
  },
  {
    names: ['shared', 'common', 'lib', 'libs'],
    deprecatedNames: ['common', 'lib', 'libs'],
    displayedActualNames: ['shared'],
    hasSlices: false,
  },
];

export const listNames = (names: string[]): string =>
  names.reduce((acc, name, index) => {
    if (index <= 0) return `'${name}'`;
    if (index !== names.length - 1) return `${acc}, '${name}'`;
    return `${acc} or '${name}'`;
  }, '');
