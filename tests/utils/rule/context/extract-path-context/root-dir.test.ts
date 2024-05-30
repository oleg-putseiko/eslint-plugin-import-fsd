import { extractPathContext } from '../../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractPathContext>[0];

class TestClass {}

describe('rootDir context property', () => {
  it('should be equal to cwd', () => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '',
      settings: {},
    };

    expect(extractPathContext(ruleContext)?.rootDir).toBe('/foo/bar');
  });

  it('should be equal to rootDir from settings', () => {
    const ruleContext: RuleContext = {
      cwd: '',
      filename: '',
      settings: { fsd: { rootDir: '/foo/bar' } },
    };

    expect(extractPathContext(ruleContext)?.rootDir).toBe('/foo/bar');
  });

  it('should be resolved based on cwd', () => {
    const ruleContext: RuleContext = {
      cwd: '/foo',
      filename: '',
      settings: { fsd: { rootDir: './bar' } },
    };

    expect(extractPathContext(ruleContext)?.rootDir).toBe('/foo/bar');
  });

  it('should give priority to rootDir from settings over cwd', () => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '',
      settings: { fsd: { rootDir: '/baz/qux' } },
    };

    expect(extractPathContext(ruleContext)?.rootDir).toBe('/baz/qux');
  });

  it.each([
    { rootDir: null, type: 'null' },
    { rootDir: undefined, type: 'undefined' },
    { rootDir: 0, type: 'falsy number' },
    { rootDir: 123, type: 'truthy number' },
    { rootDir: 123n, type: 'bigint' },
    { rootDir: true, type: 'true' },
    { rootDir: false, type: 'false' },
    { rootDir: Symbol(), type: 'symbol' },
    { rootDir: () => 'fooBar', type: 'function' },
    { rootDir: new TestClass(), type: 'class instance' },
    { rootDir: {}, type: 'object' },
    { rootDir: ['foo', 'bar'], type: 'array' },
  ])(
    'should give priority to cwd over rootDir from settings if rootDir is $type',
    ({ rootDir }) => {
      const ruleContext: RuleContext = {
        cwd: '/foo/bar',
        filename: '',
        settings: { fsd: { rootDir } },
      };

      expect(extractPathContext(ruleContext)?.rootDir).toBe('/foo/bar');
    },
  );
});
