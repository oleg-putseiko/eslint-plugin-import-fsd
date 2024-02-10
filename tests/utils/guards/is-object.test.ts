import { isObject } from '../../../src/utils/guards';

class TestClass {}

describe('isObject', () => {
  it('should return true for an object value', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 'fooBar' })).toBe(true);
    expect(isObject(['foo', 'bar'])).toBe(true);
    expect(isObject(new TestClass())).toBe(true);
  });

  it('should return false for a non-object value', () => {
    expect(isObject('')).toBe(false);
    expect(isObject('fooBar')).toBe(false);
    expect(isObject(0)).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject(123n)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(Symbol())).toBe(false);
    expect(isObject(() => ({}))).toBe(false);
  });
});
