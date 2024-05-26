import { resolve } from '../../../src/utils/path';

describe('resolvePath', () => {
  it('should resolve non-prefixed path', () => {
    expect(resolve('foo', '')).toBe('.');
    expect(resolve('foo', 'bar')).toBe('bar');
    expect(resolve('foo', 'bar/.')).toBe('bar');
    expect(resolve('foo', 'bar/..')).toBe('.');
    expect(resolve('foo', 'bar/./baz/../qux')).toBe('bar/qux');
    expect(resolve('foo', 'bar/./baz//../qux/../../')).toBe('.');
    expect(resolve('foo', 'bar/./baz/../qux/../../..')).toBe('..');
  });

  it('should resolve absolute path', () => {
    expect(resolve('foo', '/')).toBe('/');
    expect(resolve('foo', '/.')).toBe('/');
    expect(resolve('foo', '/..')).toBe('/');
    expect(resolve('foo', '/bar/./baz/../qux')).toBe('/bar/qux');
    expect(resolve('foo', '/./bar/./baz//../qux/../../')).toBe('/');
    expect(resolve('foo', '/bar/./baz/../qux/../../..')).toBe('/');
  });

  it('should resolve relative path from absolute root directory path', () => {
    expect(resolve('/foo', './')).toBe('/foo');
    expect(resolve('/foo', './.')).toBe('/foo');
    expect(resolve('/foo', './..')).toBe('/');
    expect(resolve('/foo', './bar/./baz/../qux')).toBe('/foo/bar/qux');
    expect(resolve('/foo', '././bar/./baz//../qux/../../')).toBe('/foo');
    expect(resolve('/foo', './bar/./baz/../qux/../../..')).toBe('/');
    expect(resolve('/foo', './bar/./baz/../qux/../../..///..')).toBe('/');
  });

  it('should resolve relative path from relative current root directory path', () => {
    expect(resolve('./foo', './')).toBe('foo');
    expect(resolve('./foo', './.')).toBe('foo');
    expect(resolve('./foo', './..')).toBe('.');
    expect(resolve('./foo', './bar/./baz/../qux')).toBe('foo/bar/qux');
    expect(resolve('./foo', '././bar/./baz//../qux/../../')).toBe('foo');
    expect(resolve('./foo', './bar/./baz/../qux/../../..')).toBe('.');
  });

  it('should resolve relative path from relative previous root directory path', () => {
    expect(resolve('../foo', './')).toBe('../foo');
    expect(resolve('../foo', './.')).toBe('../foo');
    expect(resolve('../foo', './..')).toBe('..');
    expect(resolve('../foo', './bar/./baz/../qux')).toBe('../foo/bar/qux');
    expect(resolve('../foo', '././bar/./baz//../qux/../../')).toBe('../foo');
    expect(resolve('../foo', './bar/./baz/../qux/../../..')).toBe('..');
  });
});
