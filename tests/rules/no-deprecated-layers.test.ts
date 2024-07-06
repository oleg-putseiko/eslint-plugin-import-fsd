import { RuleTester } from 'eslint';

import plugin from '../../dist';

// prettier-ignore
const DEPRECATED_LAYERS: string[] = [
  'core', 'init', 
  'flow', 'flows', 'workflow', 'workflows',
  'screen', 'screens', 'view', 'views', 'layout', 'layouts',
  'component', 'components', 'container', 'containers',
  'model', 'models',
  'common', 'lib', 'libs',
];

const tester = new RuleTester({
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
});

const noDeprecatedLayersRule = plugin.rules['no-deprecated-layers'];

describe.each(DEPRECATED_LAYERS)('deprecated %s file layer', (fileLayer) => {
  tester.run(
    'import from a segment-level file should be allowed',
    noDeprecatedLayersRule,
    {
      valid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'import' }],
          code: 'import foo from "bar"',
        },
      ],
      invalid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'file' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux/quux.js`,
          options: [{ scope: 'all' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
      ],
    },
  );

  tester.run(
    'import from a slice-level file should be allowed',
    noDeprecatedLayersRule,
    {
      valid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'import' }],
          code: 'import foo from "bar"',
        },
      ],
      invalid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'file' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}/qux.js`,
          options: [{ scope: 'all' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
      ],
    },
  );

  tester.run(
    'import from a layer-level file should be allowed',
    noDeprecatedLayersRule,
    {
      valid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'import' }],
          code: 'import foo from "bar"',
        },
      ],
      invalid: [
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'file' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
        {
          settings: { fsd: { rootDir: '/src' } },
          filename: `/src/${fileLayer}.js`,
          options: [{ scope: 'all' }],
          code: 'import foo from "bar"',
          errors: [{ messageId: 'replaceableDeprecatedFileLayer' }],
        },
      ],
    },
  );
});
