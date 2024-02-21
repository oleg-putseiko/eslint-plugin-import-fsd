import { DECLARATIONS } from '../../../../src/utils/rule/declarations';

describe('DECLARATIONS', () => {
  it('should only have "import", "file" and "all" values', () => {
    expect(DECLARATIONS).toContain('import');
    expect(DECLARATIONS).toContain('file');
    expect(DECLARATIONS).toContain('all');

    expect(DECLARATIONS).toHaveLength(3);
  });
});
