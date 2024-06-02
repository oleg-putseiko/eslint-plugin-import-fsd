import { extractPathContext } from '../../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractPathContext>[0];

class TestClass {}

describe('overrides context property', () => {
  it.each([
    { overrides: null, type: 'null' },
    { overrides: undefined, type: 'undefined' },
  ])('should be empty object if it is $type', ({ overrides }) => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '/baz/qux.js',
      settings: { fsd: { overrides } },
    };

    expect(extractPathContext(ruleContext)?.overrides).toEqual({});
  });

  it.each([
    { overrides: {}, type: 'empty object' },
    {
      overrides: {
        fooBar: { layer: 'foo', slice: 'bar' },
        '123': { layer: 'baz', slice: 'qux' },
        '': { layer: 'qux', slice: 'quux' },
      },
      type: 'object with assigned segments',
    },
  ])('should be the same as passed if it is $type', ({ overrides }) => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '/baz/qux.js',
      settings: { fsd: { overrides } },
    };

    expect(extractPathContext(ruleContext)?.overrides).toEqual(overrides);
  });

  it.each([
    { overrides: 0, type: 'falsy number' },
    { overrides: 123, type: 'truthy number' },
    { overrides: 123n, type: 'bigint' },
    { overrides: true, type: 'true' },
    { overrides: false, type: 'false' },
    { overrides: Symbol(), type: 'symbol' },
    { overrides: () => 'fooBar', type: 'function' },
    { overrides: ['foo', 'bar'], type: 'string array' },
    {
      overrides: { fooBar: { layer: 'foo' } },
      type: 'object without slice segment',
    },
    {
      overrides: { fooBar: { slice: 'foo' } },
      type: 'object without layer segment',
    },
    { overrides: [], type: 'empty array' },
  ])(
    'context should be null if the overrides property from settings is $type',
    ({ overrides }) => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '/baz/qux.js',
        settings: { fsd: { overrides } },
      };

      expect(extractPathContext(ruleContext)).toBeNull();
    },
  );

  // TODO: remove `failing` and merge with the same tests
  it.failing.each([{ overrides: new TestClass(), type: 'class instance' }])(
    'context should be null if the overrides property from settings is $type',
    ({ overrides }) => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '/baz/qux.js',
        settings: { fsd: { overrides } },
      };

      expect(extractPathContext(ruleContext)).toBeNull();
    },
  );
});
