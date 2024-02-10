import { isStringArray } from '../../../src/utils/guards';

describe('isStringArray', () => {
  it('should return true', () => {
    expect(isStringArray([])).toBe(true);
    expect(isStringArray(['foo', 'bar'])).toBe(true);
  });

  it('should return false', () => {
    const TEST_VALUES = [
      123,
      123n,
      true,
      null,
      undefined,
      Symbol(),
      [1, 2],
      [1, 2, 'foo', 'bar'],
      () => 'fooBar',
      {},
    ];

    TEST_VALUES.forEach((testValue) => {
      expect(isStringArray(testValue)).toBe(false);
    });
  });
});
