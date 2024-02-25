import { extractPathContext } from '../../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractPathContext>[0];

class TestClass {}

describe('aliases context property', () => {
  it.each([
    { aliases: null, type: 'null' },
    { aliases: undefined, type: 'undefined' },
  ])('should be empty object if it is $type', ({ aliases }) => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '/baz/qux',
      settings: { fsd: { aliases } },
    };

    expect(extractPathContext(ruleContext)?.aliases).toEqual({});
  });

  it.each([
    { aliases: {}, type: 'empty object' },
    {
      aliases: {
        '@/src/*': './src/*',
        '~/src/*': '/src/*',
        fooBar: 'baz-qux',
        '*': '*',
        '': '',
      },
      type: 'object with string replacements',
    },
  ])('should be the same as passed if it is $type', ({ aliases }) => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '/baz/qux',
      settings: { fsd: { aliases } },
    };

    expect(extractPathContext(ruleContext)?.aliases).toEqual(aliases);
  });

  it.each([
    { aliases: 0, type: 'falsy number' },
    { aliases: 123, type: 'truthy number' },
    { aliases: 123n, type: 'bigint' },
    { aliases: true, type: 'true' },
    { aliases: false, type: 'false' },
    { aliases: Symbol(), type: 'symbol' },
    { aliases: () => 'fooBar', type: 'function' },
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
  ])(
    'context should be null if the aliases property from settings is $type',
    ({ aliases }) => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '/baz/qux',
        settings: { fsd: { aliases } },
      };

      expect(extractPathContext(ruleContext)).toBeNull();
    },
  );

  // TODO: remove `failing` and merge with the same tests
  it.failing.each([
    { aliases: new TestClass(), type: 'class instance' },
    { aliases: ['foo', 'bar'], type: 'string array' },
    { aliases: [], type: 'empty array' },
  ])(
    'context should be null if the aliases property from settings is $type',
    ({ aliases }) => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '/baz/qux',
        settings: { fsd: { aliases } },
      };

      expect(extractPathContext(ruleContext)).toBeNull();
    },
  );
});
