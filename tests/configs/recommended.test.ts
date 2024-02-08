import { configs } from '../../src';

describe('configs', () => {
  describe('recommended', () => {
    it('should have all the rules', () => {
      const EXPECTED_RULE_NAMES = [
        'import-fsd/no-denied-layers',
        'import-fsd/no-deprecated-layers',
        'import-fsd/no-unknown-layers',
      ];

      const rules = configs.recommended.rules;
      const ruleNames = rules ? Object.keys(rules) : [];

      expect(rules).not.toBeUndefined();
      expect(ruleNames.length).toBe(EXPECTED_RULE_NAMES.length);

      EXPECTED_RULE_NAMES.forEach((name) => {
        expect(rules).toHaveProperty(name);
      });
    });

    it('each rule should have a severity', () => {
      const rules = configs.recommended.rules;

      expect(rules?.['import-fsd/no-denied-layers']).toEqual('error');
      expect(rules?.['import-fsd/no-deprecated-layers']).toEqual('warn');
      expect(rules?.['import-fsd/no-unknown-layers']).toEqual('error');
    });
  });
});
