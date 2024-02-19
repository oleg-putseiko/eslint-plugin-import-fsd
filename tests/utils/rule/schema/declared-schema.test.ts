import { DECLARED_SCHEMA } from '../../../../src/utils/rule/schema';

describe('DECLARED_SCHEMA', () => {
  it('should be of type object', () => {
    expect(DECLARED_SCHEMA.type).toBe('object');
  });

  it('should only have properties ignores and declaration', () => {
    expect(DECLARED_SCHEMA.properties).toHaveProperty('ignores');
    expect(DECLARED_SCHEMA.properties).toHaveProperty('declaration');

    expect(Object.keys(DECLARED_SCHEMA.properties ?? {})).toHaveLength(2);
  });

  it('the ignores property should be an array of strings', () => {
    expect(DECLARED_SCHEMA.properties?.ignores).toEqual({
      type: 'array',
      items: { type: 'string' },
    });
  });

  it('the declaration property should be enumeration of declarations', () => {
    const enumeration = DECLARED_SCHEMA.properties?.declaration.enum;

    expect(enumeration).toContain('import');
    expect(enumeration).toContain('file');
    expect(enumeration).toContain('all');

    expect(enumeration).toHaveLength(3);
  });

  it('should not have additional properties', () => {
    expect(DECLARED_SCHEMA.additionalProperties).toBe(false);
  });
});
