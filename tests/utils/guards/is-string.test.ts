import { isString } from '../../../src/utils/guards';

describe('isString', () => {
  it('should return true', () => {
    expect(isString('fooBar')).toBe(true);
  });

  it('should return false', () => {
    const TEST_VALUES = [
      123,
      123n,
      true,
      null,
      undefined,
      Symbol(),
      ['foo', 'bar'],
      () => 'fooBar',
      {},
    ];

    TEST_VALUES.forEach((testValue) => {
      expect(isString(testValue)).toBe(false);
    });
  });
});
