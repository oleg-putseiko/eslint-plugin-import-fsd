import { BASE_SCHEMA } from '../../../../src/utils/rule/schema';

describe('BASE_SCHEMA', () => {
  it('should be of type object', () => {
    expect(BASE_SCHEMA.type).toBe('object');
  });

  it('should not have properties except ignores', () => {
    expect(BASE_SCHEMA.properties).toHaveProperty('ignores');
    expect(Object.keys(BASE_SCHEMA.properties ?? {})).toHaveLength(1);
  });

  it('the ignores property should be an array of strings', () => {
    expect(BASE_SCHEMA.properties?.ignores).toEqual({
      type: 'array',
      items: { type: 'string' },
    });
  });

  it('should not have additional properties', () => {
    expect(BASE_SCHEMA.additionalProperties).toBe(false);
  });
});
