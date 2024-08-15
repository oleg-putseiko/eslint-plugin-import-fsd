import plugin from '../../dist/index';

const { configs } = plugin;

describe('recommended-legacy config', () => {
  it('should have three rules', () => {
    const rules = configs['recommended-legacy'].rules ?? {};

    expect(Object.keys(rules)).toHaveLength(3);
  });

  it('should have plugin as a dependency', () => {
    const rules = configs['recommended-legacy'].plugins ?? [];

    expect(rules).toContain('import-fsd');
  });

  it.each([
    { rule: 'import-fsd/no-denied-layers' },
    { rule: 'import-fsd/no-deprecated-layers' },
    { rule: 'import-fsd/no-unknown-layers' },
  ])('should have rule $rule', ({ rule }) => {
    expect(configs['recommended-legacy'].rules).toHaveProperty(rule);
  });

  it.each([
    { rule: 'import-fsd/no-denied-layers' },
    { rule: 'import-fsd/no-deprecated-layers' },
    { rule: 'import-fsd/no-unknown-layers' },
  ])('rule $rule should not have options', ({ rule }) => {
    expect(Array.isArray(configs['recommended-legacy'].rules?.[rule])).toBe(
      false,
    );
  });

  it.each([
    { rule: 'import-fsd/no-denied-layers', severity: 'error' },
    { rule: 'import-fsd/no-deprecated-layers', severity: 'warn' },
    { rule: 'import-fsd/no-unknown-layers', severity: 'error' },
  ])('rule $rule should have $severity severity', ({ rule, severity }) => {
    expect(configs['recommended-legacy'].rules?.[rule]).toEqual(severity);
  });
});
