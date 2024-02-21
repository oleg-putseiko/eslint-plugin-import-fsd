import {
  Declaration,
  isFileDeclaration,
} from '../../../../src/utils/rule/declarations';

describe('isFileDeclaration', () => {
  it('should return true for a file declaration enumeration value', () => {
    expect(isFileDeclaration(Declaration.File)).toBe(true);
  });

  it('should return true for an all declaration enumeration value', () => {
    expect(isFileDeclaration(Declaration.All)).toBe(true);
  });

  it('should return false for an import declaration enumeration value', () => {
    expect(isFileDeclaration(Declaration.Import)).toBe(false);
  });
});
