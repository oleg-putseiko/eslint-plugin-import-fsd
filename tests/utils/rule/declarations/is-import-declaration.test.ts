import {
  Declaration,
  isImportDeclaration,
} from '../../../../src/utils/rule/declarations';

describe('isImportDeclaration', () => {
  it('should return true for an import declaration enumeration value', () => {
    expect(isImportDeclaration(Declaration.Import)).toBe(true);
  });

  it('should return true for an all declaration enumeration value', () => {
    expect(isImportDeclaration(Declaration.All)).toBe(true);
  });

  it('should return false for a file declaration enumeration value', () => {
    expect(isImportDeclaration(Declaration.File)).toBe(false);
  });
});
