import {
  Declaration,
  isDeclaration,
} from '../../../../src/utils/rule/declarations';

class TestClass {}

describe('isDeclaration', () => {
  it('should return true for a declaration string value', () => {
    expect(isDeclaration('import')).toBe(true);
    expect(isDeclaration('file')).toBe(true);
    expect(isDeclaration('all')).toBe(true);
  });

  it('should return true for a declaration enumeration value', () => {
    expect(isDeclaration(Declaration.Import)).toBe(true);
    expect(isDeclaration(Declaration.File)).toBe(true);
    expect(isDeclaration(Declaration.All)).toBe(true);
  });

  it('should return false for a non-declaration string value', () => {
    expect(isDeclaration('imports')).toBe(false);
    expect(isDeclaration('files')).toBe(false);
    expect(isDeclaration('qwe')).toBe(false);
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
    expect(isDeclaration(value)).toBe(false);
  });
});
