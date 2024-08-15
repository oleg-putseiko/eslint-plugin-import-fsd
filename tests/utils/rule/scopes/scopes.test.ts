import { SCOPES } from '../../../../src/utils/rule/scope';

describe('SCOPES', () => {
  it('should only have "import", "file" and "all" values', () => {
    expect(SCOPES).toContain('import');
    expect(SCOPES).toContain('file');
    expect(SCOPES).toContain('all');

    expect(SCOPES).toHaveLength(3);
  });
});
