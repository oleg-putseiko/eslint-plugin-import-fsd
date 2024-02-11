import { isString } from '../../../src/utils/guards';

class TestClass {}

describe('isString', () => {
  it('should return true for string value', () => {
    expect(isString('')).toBe(true);
    expect(isString('fooBar')).toBe(true);
    expect(isString(String())).toBe(true);
  });

  it('should return false for non-string value', () => {
    expect(isString(0)).toBe(false);
    expect(isString(123)).toBe(false);
    expect(isString(123n)).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString(false)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(Symbol())).toBe(false);
    expect(isString(['foo', 'bar'])).toBe(false);
    expect(isString([1, 2, 'foo', 'bar'])).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString({ a: 'fooBar' })).toBe(false);
    expect(isString({ 0: 'foo', 1: 'bar', length: 2 })).toBe(false);
    expect(isString(() => ['foo', 'bar'])).toBe(false);
    expect(isString(new TestClass())).toBe(false);
  });
});
