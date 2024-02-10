import { isObject } from '../../../src/utils/guards';

describe('isObject', () => {
  it('should return true', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(['foo', 'bar'])).toBe(true);
  });

  it('should return false', () => {
    const TEST_VALUES = [
      'fooBar',
      123,
      123n,
      true,
      null,
      undefined,
      Symbol(),
      () => 'fooBar',
    ];

    TEST_VALUES.forEach((testValue) => {
      expect(isObject(testValue)).toBe(false);
    });
  });
});
