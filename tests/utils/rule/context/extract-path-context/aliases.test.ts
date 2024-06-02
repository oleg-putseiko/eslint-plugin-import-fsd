import { extractPathContext } from '../../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractPathContext>[0];

describe('aliases context property', () => {
  it.each([
    { aliases: 0, type: 'falsy number' },
    { aliases: 123, type: 'truthy number' },
    { aliases: 123n, type: 'bigint' },
    { aliases: true, type: 'true' },
    { aliases: false, type: 'false' },
    { aliases: Symbol(), type: 'symbol' },
    { aliases: () => 'fooBar', type: 'function' },
    { aliases: [], type: 'array' },
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
  ])('context should be null if the aliases is $type', ({ aliases }) => {
    const ruleContext: RuleContext = {
      cwd: '/',
      filename: '/foo/bar.js',
      settings: { fsd: { aliases } },
    };

    expect(extractPathContext(ruleContext)).toBeNull();
  });
});
