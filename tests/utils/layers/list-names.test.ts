import { listNames } from '../../../src/utils/layers';

describe('listNames', () => {
  it('should return an empty string', () => {
    expect(listNames([])).toBe('');
  });

  it('should return a string with a list of passed names', () => {
    expect(listNames([''])).toBe("''");
    expect(listNames(['foo'])).toBe("'foo'");
    expect(listNames(['foo', 'bar'])).toBe("'foo' or 'bar'");
    expect(listNames(['foo', 'bar', 'baz'])).toBe("'foo', 'bar' or 'baz'");
    expect(listNames(['foo', '', 'bar', 'baz'])).toBe(
      "'foo', '', 'bar' or 'baz'",
    );
  });
});
