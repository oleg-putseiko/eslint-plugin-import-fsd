import { SCOPED_SCHEMA } from '../../../../src/utils/rule/schema';

describe('DECLARED_SCHEMA', () => {
  it('should be of type object', () => {
    expect(SCOPED_SCHEMA.type).toBe('object');
  });

  it('should only have properties ignores and scope', () => {
    expect(SCOPED_SCHEMA.properties).toHaveProperty('ignores');
    expect(SCOPED_SCHEMA.properties).toHaveProperty('scope');

    expect(Object.keys(SCOPED_SCHEMA.properties ?? {})).toHaveLength(2);
  });

  it('the ignores property should be an array of strings', () => {
    expect(SCOPED_SCHEMA.properties?.ignores).toEqual({
      type: 'array',
      items: { type: 'string' },
    });
  });

  it('the scope property should be enumeration of scopes', () => {
    const enumeration = SCOPED_SCHEMA.properties?.scope.enum;

    expect(enumeration).toContain('import');
    expect(enumeration).toContain('file');
    expect(enumeration).toContain('all');

    expect(enumeration).toHaveLength(3);
  });

  it('should not have additional properties', () => {
    expect(SCOPED_SCHEMA.additionalProperties).toBe(false);
  });
});
