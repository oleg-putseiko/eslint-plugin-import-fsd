import { isStringArray } from '../../../src/utils/guards';

class TestClass {}

describe('isStringArray', () => {
  it('should return true for a value of type array of strings', () => {
    expect(isStringArray([])).toBe(true);
    expect(isStringArray(['foo', 'bar'])).toBe(true);
    expect(isStringArray(['', 'fooBar', String()])).toBe(true);
  });

  it('should return false for a value of type not an array of strings', () => {
    expect(isStringArray('')).toBe(false);
    expect(isStringArray('fooBar')).toBe(false);
    expect(isStringArray(0)).toBe(false);
    expect(isStringArray(123)).toBe(false);
    expect(isStringArray(123n)).toBe(false);
    expect(isStringArray(true)).toBe(false);
    expect(isStringArray(false)).toBe(false);
    expect(isStringArray(null)).toBe(false);
    expect(isStringArray(undefined)).toBe(false);
    expect(isStringArray(Symbol())).toBe(false);
    expect(isStringArray([1, 2])).toBe(false);
    expect(isStringArray([1, 2, 'foo', 'bar'])).toBe(false);
    expect(isStringArray({})).toBe(false);
    expect(isStringArray({ a: 'fooBar' })).toBe(false);
    expect(isStringArray({ 0: 'foo', 1: 'bar', length: 2 })).toBe(false);
    expect(isStringArray(() => ['foo', 'bar'])).toBe(false);
    expect(isStringArray(new TestClass())).toBe(false);
  });
});
