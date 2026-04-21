import plugin from '../../src';

const { configs } = plugin;

describe('recommended config', () => {
  const EXPECTED_RULES = [
    { rule: 'import-fsd/no-denied-layers', severity: 'error' },
    { rule: 'import-fsd/no-deprecated-layers', severity: 'warn' },
    { rule: 'import-fsd/no-unknown-layers', severity: 'error' },
  ];

  it('should have exactly three rules', () => {
    const rules = configs.recommended.rules ?? {};
    expect(Object.keys(rules)).toHaveLength(3);
  });

  it('should have plugin as a dependency', () => {
    const plugins = configs.recommended.plugins ?? {};
    expect(plugins['import-fsd']).toBe(plugin);
  });

  describe('rules configuration', () => {
    it.each(EXPECTED_RULES)(
      'rule "$rule" should be configured with "$severity" severity and no options',
      ({ rule, severity }) => {
        const ruleConfig = configs.recommended.rules?.[rule];

        expect(ruleConfig).toBeDefined();
        expect(Array.isArray(ruleConfig)).toBe(false);
        expect(ruleConfig).toBe(severity);
      },
    );
  });
});
