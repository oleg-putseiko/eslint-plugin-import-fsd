import { resolvePath } from '../../../src/utils/path';

describe('resolvePath', () => {
  describe('should resolve absolute path with', () => {
    it.each(
      // prettier-ignore
      [
        { dir: '', case: 'empty dir value' },
        { dir: 'foo', case: 'neither absolute nor relative dir value with different first segment' },
        { dir: 'foo/bar', case: 'neither absolute nor relative dir value with different first two segments' },
        { dir: 'qux', case: 'neither absolute nor relative dir value with identical first segment' },
        { dir: 'qux/quux', case: 'neither absolute nor relative dir value with identical first two segments' },
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
    )('$case', ({ dir }) =>
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
  });

  describe('should return neither absolute nor relative path as passed with', () => {
    it.each(
      // prettier-ignore
      [
        { dir: '', case: 'empty dir value' },
        { dir: 'foo', case: 'neither absolute nor relative dir value with different first segment' },
        { dir: 'foo/bar', case: 'neither absolute nor relative dir value with different first two segments' },
        { dir: 'qux', case: 'neither absolute nor relative dir value with identical first segment' },
        { dir: 'qux/quux', case: 'neither absolute nor relative dir value with identical first two segments' },
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
    )('$case', ({ dir }) =>
      // prettier-ignore
      {
        expect(resolvePath('', '')).toBe('');
        expect(resolvePath(dir, '.qux')).toBe('.qux');
        expect(resolvePath(dir, '..qux')).toBe('..qux');
        expect(resolvePath(dir, '@qux')).toBe('@qux');
        expect(resolvePath(dir, '@/qux')).toBe('@/qux');
        expect(resolvePath(dir, '~/qux')).toBe('~/qux');
        expect(resolvePath(dir, 'qux')).toBe('qux');
        expect(resolvePath(dir, 'qux/quux')).toBe('qux/quux');
        expect(resolvePath(dir, 'qux/quux/quuux')).toBe('qux/quux/quuux');
        expect(resolvePath(dir, 'qux/./quux/quuux')).toBe('qux/./quux/quuux');
        expect(resolvePath(dir, 'qux/../quux/quuux')).toBe('qux/../quux/quuux');
        expect(resolvePath(dir, 'qux/quux/quuux/.')).toBe('qux/quux/quuux/.');
        expect(resolvePath(dir, 'qux/quux/quuux/./')).toBe('qux/quux/quuux/./');
        expect(resolvePath(dir, 'qux/quux/quuux/..')).toBe('qux/quux/quuux/..');
        expect(resolvePath(dir, 'qux/quux/quuux/../')).toBe('qux/quux/quuux/../');
        expect(resolvePath(dir, 'qux/../quux///quuux/./')).toBe('qux/../quux///quuux/./');
        expect(resolvePath(dir, 'qux/../quux///quuux//.././././///////./')).toBe('qux/../quux///quuux//.././././///////./');
        expect(resolvePath(dir, 'qux/../quux///quuux//.././././///////./.')).toBe('qux/../quux///quuux//.././././///////./.');
        expect(resolvePath('', 'qux/../quux///quuux//.././././///////./..')).toBe('qux/../quux///quuux//.././././///////./..'); 
      },
    );
  });
});
