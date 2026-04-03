import { joinNames } from '../../../src/utils/layers';

describe('listNames', () => {
  const TEST_CASES: Array<[string[], string]> = [
    [[], ''],
    [[''], "''"],
    [['foo'], "'foo'"],
    [['foo', 'bar'], "'foo' or 'bar'"],
    [['foo', 'bar', 'baz'], "'foo', 'bar' or 'baz'"],
    [['foo', '', 'bar', 'baz'], "'foo', '', 'bar' or 'baz'"],
  ];

  it.each(TEST_CASES)('should format %p as %p', (input, expected) => {
    expect(joinNames(input)).toBe(expected);
  });
});
