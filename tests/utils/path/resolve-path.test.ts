import { resolvePath } from '../../../src/utils/path';

describe('resolvePath', () => {
  it.each(
    // prettier-ignore
    [
      { dir: '', case: 'empty dir value' },
      { dir: 'foo', case: 'neither absolute nor relative dir value' },
      { dir: '/', case: 'absolute dir value without segments' },
      { dir: '/foo', case: 'absolute dir value with different first segments' },
      { dir: '/foo/bar', case: 'absolute dir value with different first two segments' },
      { dir: '/qux', case: 'absolute dir value with identical first segment' },
      { dir: '/qux/quux', case: 'absolute dir value with identical first two segments' },
      { dir: './', case: 'relative dir value of current directory' },
      { dir: './foo', case: 'dir value relative to current directory with different first segment' },
      { dir: './foo/bar', case: 'dir value relative to current directory with different first two segments' },
      { dir: './qux', case: 'dir value relative to current directory with identical first segment' },
      { dir: './qux/quux', case: 'dir value relative to current directory with different first two segments' },
      { dir: '../', case: 'relative dir value of previous directory' },
      { dir: '../foo', case: 'dir value relative to previous directory with different first segment' },
      { dir: '../foo/bar', case: 'dir value relative to previous directory with different first two segments' },
      { dir: '../qux', case: 'dir value relative to previous directory with identical first segment' },
      { dir: '../qux/quux', case: 'dir value relative to previous directory with identical first two segments' },
    ],
  )('should resolve absolute path with $case', ({ dir }) =>
    // prettier-ignore
    {
      // TODO: resolve to '/'
      expect(resolvePath('', '/')).toBe('');
      expect(resolvePath(dir, '/qux')).toBe('/qux');
      expect(resolvePath(dir, '/qux/quux')).toBe('/qux/quux');
      expect(resolvePath(dir, '/qux/quux/quuux')).toBe('/qux/quux/quuux');
      expect(resolvePath(dir, '/qux/./quux/quuux')).toBe('/qux/quux/quuux');
      expect(resolvePath(dir, '/qux/../quux/quuux')).toBe('/quux/quuux');
      expect(resolvePath(dir, '/qux/quux/quuux/.')).toBe('/qux/quux/quuux');
      expect(resolvePath(dir, '/qux/quux/quuux/./')).toBe('/qux/quux/quuux');
      expect(resolvePath(dir, '/qux/quux/quuux/..')).toBe('/qux/quux');
      expect(resolvePath(dir, '/qux/quux/quuux/../')).toBe('/qux/quux');
      expect(resolvePath(dir, '/qux/../quux///quuux/./')).toBe('/quux/quuux');
      expect(resolvePath(dir, '/qux/../quux///quuux//.././././///////./')).toBe('/quux');
      expect(resolvePath(dir, '/qux/../quux///quuux//.././././///////./.')).toBe('/quux');
      expect(resolvePath(dir, '/./qux/../quux///quuux//.././././///////./.')).toBe('/quux');
      // TODO: resolve to '/'
      expect(resolvePath('', '/qux/../quux///quuux//.././././///////./..')).toBe(''); 
    },
  );

  it('should return neither absolute nor relative path as passed', () =>
    // prettier-ignore
    {
    expect(resolvePath('', '')).toBe('');
    expect(resolvePath('', 'qux')).toBe('qux');
    expect(resolvePath('', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');

    expect(resolvePath('foo', '')).toBe('');
    expect(resolvePath('foo', 'qux')).toBe('qux');
    expect(resolvePath('foo', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('foo', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('foo', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('foo', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('foo', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('foo', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('foo', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('foo', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('foo', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');

    expect(resolvePath('qux', '')).toBe('');
    expect(resolvePath('qux', 'qux')).toBe('qux');
    expect(resolvePath('qux', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('qux', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('qux', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('qux', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('qux', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('qux', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('qux', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('qux', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('qux', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');

    expect(resolvePath('qux/quux', '')).toBe('');
    expect(resolvePath('qux/quux', 'qux')).toBe('qux');
    expect(resolvePath('qux/quux', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('qux/quux', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('qux/quux', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('qux/quux', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('qux/quux', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('qux/quux', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('qux/quux', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('qux/quux', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('qux/quux', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');

    expect(resolvePath('/', '')).toBe('');
    expect(resolvePath('/', 'qux')).toBe('qux');
    expect(resolvePath('/', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('/', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('/', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('/', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('/', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('/', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('/', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('/', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('/', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');

    expect(resolvePath('/foo', '')).toBe('');
    expect(resolvePath('/foo', 'qux')).toBe('qux');
    expect(resolvePath('/foo', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('/foo', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('/foo', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('/foo', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('/foo', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('/foo', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('/foo', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('/foo', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('/foo', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');

    expect(resolvePath('/foo', 'foo')).toBe('foo');
    expect(resolvePath('/foo/bar', 'foo/bar')).toBe('foo/bar');
    expect(resolvePath('/foo/bar', 'foo/quuux')).toBe('foo/quuux');

    expect(resolvePath('./', '')).toBe('');
    expect(resolvePath('./', 'qux')).toBe('qux');
    expect(resolvePath('./', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('./', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('./', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('./', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('./', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('./', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('./', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('./', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('./', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');

    expect(resolvePath('../', '')).toBe('');
    expect(resolvePath('../', 'qux')).toBe('qux');
    expect(resolvePath('../', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('../', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('../', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('../', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('../', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('../', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('../', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('../', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('../', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');

    expect(resolvePath('../foo', '')).toBe('');
    expect(resolvePath('../foo', 'qux')).toBe('qux');
    expect(resolvePath('../foo', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('../foo', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('../foo', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('../foo', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('../foo', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('../foo', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('../foo', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('../foo', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('../foo', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');

    expect(resolvePath('../foo/', '')).toBe('');
    expect(resolvePath('../foo/', 'qux')).toBe('qux');
    expect(resolvePath('../foo/', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('../foo/', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('../foo/', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('../foo/', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('../foo/', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('../foo/', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('../foo/', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('../foo/', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('../foo/', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');

    expect(resolvePath('../foo/bar', '')).toBe('');
    expect(resolvePath('../foo/bar', 'qux')).toBe('qux');
    expect(resolvePath('../foo/bar', 'qux/quux')).toBe('qux/quux');
    expect(resolvePath('../foo/bar', 'qux/quux/quuux')).toBe('qux/quux/quuux');
    expect(resolvePath('../foo/bar', 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
    expect(resolvePath('../foo/bar', 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
    expect(resolvePath('../foo/bar', 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
    expect(resolvePath('../foo/bar', 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
    expect(resolvePath('../foo/bar', 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
    expect(resolvePath('../foo/bar', 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
    expect(resolvePath('../foo/bar', 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');
  });
});
