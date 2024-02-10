import { configs } from '../../src';

describe('configs', () => {
  describe('recommended', () => {
    it('should have three rules', () => {
      const rules = configs.recommended.rules ?? {};

      expect(Object.keys(rules)).toHaveLength(3);
    });

    it.each([
      { rule: 'import-fsd/no-denied-layers' },
      { rule: 'import-fsd/no-deprecated-layers' },
      { rule: 'import-fsd/no-unknown-layers' },
    ])('should have rule $rule', ({ rule }) => {
      expect(configs.recommended.rules).toHaveProperty(rule);
    });

    it.each([
      { rule: 'import-fsd/no-denied-layers' },
      { rule: 'import-fsd/no-deprecated-layers' },
      { rule: 'import-fsd/no-unknown-layers' },
    ])('rule $rule should not have options', ({ rule }) => {
      expect(Array.isArray(configs.recommended.rules?.[rule])).toBe(false);
    });

    it.each([
      { rule: 'import-fsd/no-denied-layers', severity: 'error' },
      { rule: 'import-fsd/no-deprecated-layers', severity: 'warn' },
      { rule: 'import-fsd/no-unknown-layers', severity: 'error' },
    ])('rule $rule should have $severity severity', ({ rule, severity }) => {
      expect(configs.recommended.rules?.[rule]).toEqual(severity);
    });
  });
});