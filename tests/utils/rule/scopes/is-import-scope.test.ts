import { Scope, isImportScope } from '../../../../src/utils/rule/scope';

describe('isImportScope', () => {
  it('should return true for an import scope enumeration value', () => {
    expect(isImportScope(Scope.Import)).toBe(true);
  });

  it('should return true for an all scope enumeration value', () => {
    expect(isImportScope(Scope.All)).toBe(true);
  });

  it('should return false for a file scope enumeration value', () => {
    expect(isImportScope(Scope.File)).toBe(false);
  });
});
