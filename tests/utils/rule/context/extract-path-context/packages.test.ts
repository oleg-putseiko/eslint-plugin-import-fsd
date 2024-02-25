import { extractPathContext } from '../../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractPathContext>[0];

class TestClass {}

describe('packages context property', () => {
  it.each([
    { packages: null, type: 'null' },
    { packages: undefined, type: 'undefined' },
  ])('should be empty object if it is $type', ({ packages }) => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '/baz/qux',
      settings: { fsd: { packages } },
    };

    expect(extractPathContext(ruleContext)?.packages).toEqual({});
  });

  it.each([
    { packages: {}, type: 'empty object' },
    {
      packages: {
        fooBar: { layer: 'foo', slice: 'bar' },
        '123': { layer: 'baz', slice: 'qux' },
        '': { layer: 'qux', slice: 'quux' },
      },
      type: 'object with assigned segments',
    },
  ])('should be the same as passed if it is $type', ({ packages }) => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '/baz/qux',
      settings: { fsd: { packages } },
    };

    expect(extractPathContext(ruleContext)?.packages).toEqual(packages);
  });

  it.each([
    { packages: 0, type: 'falsy number' },
    { packages: 123, type: 'truthy number' },
    { packages: 123n, type: 'bigint' },
    { packages: true, type: 'true' },
    { packages: false, type: 'false' },
    { packages: Symbol(), type: 'symbol' },
    { packages: () => 'fooBar', type: 'function' },
    { packages: ['foo', 'bar'], type: 'string array' },
    {
      packages: { fooBar: { layer: 'foo' } },
      type: 'object without slice segment',
    },
    {
      packages: { fooBar: { slice: 'foo' } },
      type: 'object without layer segment',
    },
  ])(
    'context should be null if the packages property from settings is $type',
    ({ packages }) => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '/baz/qux',
        settings: { fsd: { packages } },
      };

      expect(extractPathContext(ruleContext)).toBeNull();
    },
  );

  // TODO: remove `failing` and merge with the same tests
  it.failing.each([
    { packages: new TestClass(), type: 'class instance' },
    { packages: [], type: 'empty array' },
  ])(
    'context should be null if the packages property from settings is $type',
    ({ packages }) => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '/baz/qux',
        settings: { fsd: { packages } },
      };

      expect(extractPathContext(ruleContext)).toBeNull();
    },
  );
});
