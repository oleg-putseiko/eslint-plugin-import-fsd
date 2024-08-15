import { Scope, isFileScope } from '../../../../src/utils/rule/scope';

describe('isFileScope', () => {
  it('should return true for a file scope enumeration value', () => {
    expect(isFileScope(Scope.File)).toBe(true);
  });

  it('should return true for an all scope enumeration value', () => {
    expect(isFileScope(Scope.All)).toBe(true);
  });

  it('should return false for an import scope enumeration value', () => {
    expect(isFileScope(Scope.Import)).toBe(false);
  });
});
