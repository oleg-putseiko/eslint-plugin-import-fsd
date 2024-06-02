import { extractPathContext } from '../../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractPathContext>[0];

describe('overrides context property', () => {
  it.each([
    { overrides: 0, type: 'falsy number' },
    { overrides: 123, type: 'truthy number' },
    { overrides: 123n, type: 'bigint' },
    { overrides: true, type: 'true' },
    { overrides: false, type: 'false' },
    { overrides: Symbol(), type: 'symbol' },
    { overrides: () => 'fooBar', type: 'function' },
    { overrides: [{ layer: 'foo', slice: 'bar' }], type: 'array' },
    {
      overrides: { fooBar: { layer: 'foo' } },
      type: 'object without slice segment',
    },
    {
      overrides: { fooBar: { slice: 'foo' } },
      type: 'object without layer segment',
    },
  ])(
    'path context should be null if the overrides is $type',
    ({ overrides }) => {
      const ruleContext: RuleContext = {
        cwd: '/',
        filename: '/foo/bar.js',
        settings: { fsd: { overrides } },
      };

      expect(extractPathContext(ruleContext)).toBeNull();
    },
  );
});
