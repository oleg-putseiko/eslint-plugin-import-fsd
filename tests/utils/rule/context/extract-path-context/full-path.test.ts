import { extractPathContext } from '../../../../../src/utils/rule/context';

type RuleContext = Parameters<typeof extractPathContext>[0];

describe('fullPath context property', () => {
  it('should be the same as filename', () => {
    const ruleContext: RuleContext = {
      cwd: '/foo/bar',
      filename: '/baz/qux',
      settings: { fsd: { rootDir: '/quux/quuux' } },
    };

    expect(extractPathContext(ruleContext)?.fullPath).toBe('/baz/qux');
  });
});
