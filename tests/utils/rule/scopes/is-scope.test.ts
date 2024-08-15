import { Scope, isScope } from '../../../../src/utils/rule/scope';

class TestClass {}

describe('isScope', () => {
  it('should return true for a string value', () => {
    expect(isScope('import')).toBe(true);
    expect(isScope('file')).toBe(true);
    expect(isScope('all')).toBe(true);
  });

  it('should return true for an enumeration value', () => {
    expect(isScope(Scope.Import)).toBe(true);
    expect(isScope(Scope.File)).toBe(true);
    expect(isScope(Scope.All)).toBe(true);
  });

  it('should return false for an unsupported string value', () => {
    expect(isScope('imports')).toBe(false);
    expect(isScope('files')).toBe(false);
    expect(isScope('qwe')).toBe(false);
  });

  it.each([
    { value: 0, type: 'falsy number' },
    { value: 123, type: 'truthy number' },
    { value: 123n, type: 'bigint' },
    { value: true, type: 'true' },
    { value: false, type: 'false' },
    { value: null, type: 'null' },
    { value: undefined, type: 'undefined' },
    { value: Symbol(), type: 'symbol' },
    { value: () => 'import', type: 'function' },
    { value: new TestClass(), type: 'class instance' },
    { value: {}, type: 'object' },
    { value: ['import', 'file'], type: 'array' },
  ])('should return false for a $type value', ({ value }) => {
    expect(isScope(value)).toBe(false);
  });
});
