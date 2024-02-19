import { resolvePath } from '../../../src/utils/path';

describe('resolvePath', () => {
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
        { dir: '/foo', case: 'absolute dir value with different first segment' },
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
        expect(resolvePath(dir, '')).toBe('');
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
        expect(resolvePath(dir, 'qux/../quux///quuux//.././././///////./..')).toBe('qux/../quux///quuux//.././././///////./..'); 
      },
    );
  });

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
        { dir: '/foo', case: 'absolute dir value with different first segment' },
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
        expect(resolvePath(dir, '/')).toBe(''); // TODO: resolve to '/'
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
      },
    );
  });

  describe('should resolve relative path with', () => {
    it('absolute dir value without segments', () =>
      // prettier-ignore
      {
        expect(resolvePath('/', './')).toBe('');
        expect(resolvePath('/', './qux')).toBe('/qux');
        expect(resolvePath('/', './qux/quux')).toBe('/qux/quux');
        expect(resolvePath('/', './qux/quux/quuux')).toBe('/qux/quux/quuux');
        expect(resolvePath('/', './qux/./quux/quuux')).toBe('/qux/quux/quuux');
        expect(resolvePath('/', './qux/../quux/quuux')).toBe('/quux/quuux');
        expect(resolvePath('/', './qux/quux/quuux/.')).toBe('/qux/quux/quuux');
        expect(resolvePath('/', './qux/quux/quuux/./')).toBe('/qux/quux/quuux');
        expect(resolvePath('/', './qux/quux/quuux/..')).toBe('/qux/quux');
        expect(resolvePath('/', './qux/quux/quuux/../')).toBe('/qux/quux');
        expect(resolvePath('/', './qux/../quux///quuux/./')).toBe('/quux/quuux');
        expect(resolvePath('/', './qux/../quux///quuux//.././././///////./')).toBe('/quux');
        expect(resolvePath('/', './qux/../quux///quuux//.././././///////./.')).toBe('/quux');
        expect(resolvePath('/', '././qux/../quux///quuux//.././././///////./.')).toBe('/quux');
        expect(resolvePath('/', './qux/../quux///quuux//.././././///////./..')).toBe(''); 
      });

    it('absolute dir value with different first segment', () =>
      // prettier-ignore
      {
        expect(resolvePath('/foo', './')).toBe('/foo');
        expect(resolvePath('/foo', './qux')).toBe('/foo/qux');
        expect(resolvePath('/foo', './qux/quux')).toBe('/foo/qux/quux');
        expect(resolvePath('/foo', './qux/quux/quuux')).toBe('/foo/qux/quux/quuux');
        expect(resolvePath('/foo', './qux/./quux/quuux')).toBe('/foo/qux/quux/quuux');
        expect(resolvePath('/foo', './qux/../quux/quuux')).toBe('/foo/quux/quuux');
        expect(resolvePath('/foo', './qux/quux/quuux/.')).toBe('/foo/qux/quux/quuux');
        expect(resolvePath('/foo', './qux/quux/quuux/./')).toBe('/foo/qux/quux/quuux');
        expect(resolvePath('/foo', './qux/quux/quuux/..')).toBe('/foo/qux/quux');
        expect(resolvePath('/foo', './qux/quux/quuux/../')).toBe('/foo/qux/quux');
        expect(resolvePath('/foo', './qux/../quux///quuux/./')).toBe('/foo/quux/quuux');
        expect(resolvePath('/foo', './qux/../quux///quuux//.././././///////./')).toBe('/foo/quux');
        expect(resolvePath('/foo', './qux/../quux///quuux//.././././///////./.')).toBe('/foo/quux');
        expect(resolvePath('/foo', '././qux/../quux///quuux//.././././///////./.')).toBe('/foo/quux');
        expect(resolvePath('/foo', './qux/../quux///quuux//.././././///////./..')).toBe('/foo'); 

        expect(resolvePath('/foo', '../')).toBe('');
        expect(resolvePath('/foo', '../qux')).toBe('/qux');
        expect(resolvePath('/foo', './qux/../quux/../.././quuux')).toBe('/quuux');
        expect(resolvePath('/foo', './qux/quux/../.././../quuux/..')).toBe('');
      });

    it('absolute dir value with different first two segments', () =>
      // prettier-ignore
      {
        expect(resolvePath('/foo/bar', './')).toBe('/foo/bar');
        expect(resolvePath('/foo/bar', './qux')).toBe('/foo/bar/qux');
        expect(resolvePath('/foo/bar', './qux/quux')).toBe('/foo/bar/qux/quux');
        expect(resolvePath('/foo/bar', './qux/quux/quuux')).toBe('/foo/bar/qux/quux/quuux');
        expect(resolvePath('/foo/bar', './qux/./quux/quuux')).toBe('/foo/bar/qux/quux/quuux');
        expect(resolvePath('/foo/bar', './qux/../quux/quuux')).toBe('/foo/bar/quux/quuux');
        expect(resolvePath('/foo/bar', './qux/quux/quuux/.')).toBe('/foo/bar/qux/quux/quuux');
        expect(resolvePath('/foo/bar', './qux/quux/quuux/./')).toBe('/foo/bar/qux/quux/quuux');
        expect(resolvePath('/foo/bar', './qux/quux/quuux/..')).toBe('/foo/bar/qux/quux');
        expect(resolvePath('/foo/bar', './qux/quux/quuux/../')).toBe('/foo/bar/qux/quux');
        expect(resolvePath('/foo/bar', './qux/../quux///quuux/./')).toBe('/foo/bar/quux/quuux');
        expect(resolvePath('/foo/bar', './qux/../quux///quuux//.././././///////./')).toBe('/foo/bar/quux');
        expect(resolvePath('/foo/bar', './qux/../quux///quuux//.././././///////./.')).toBe('/foo/bar/quux');
        expect(resolvePath('/foo/bar', '././qux/../quux///quuux//.././././///////./.')).toBe('/foo/bar/quux');
        expect(resolvePath('/foo/bar', './qux/../quux///quuux//.././././///////./..')).toBe('/foo/bar'); 

        expect(resolvePath('/foo/bar', '../')).toBe('/foo');
        expect(resolvePath('/foo/bar', '../qux')).toBe('/foo/qux');
        expect(resolvePath('/foo/bar', './qux/../quux/../.././quuux')).toBe('/foo/quuux');
        expect(resolvePath('/foo/bar', './qux/quux/../.././../quuux/..')).toBe('/foo');
      });

    it('absolute dir value with identical first segment', () =>
      // prettier-ignore
      {
        expect(resolvePath('/qux', './')).toBe('/qux');
        expect(resolvePath('/qux', './qux')).toBe('/qux/qux');
        expect(resolvePath('/qux', './qux/quux')).toBe('/qux/qux/quux');
        expect(resolvePath('/qux', './qux/quux/quuux')).toBe('/qux/qux/quux/quuux');
        expect(resolvePath('/qux', './qux/./quux/quuux')).toBe('/qux/qux/quux/quuux');
        expect(resolvePath('/qux', './qux/../quux/quuux')).toBe('/qux/quux/quuux');
        expect(resolvePath('/qux', './qux/quux/quuux/.')).toBe('/qux/qux/quux/quuux');
        expect(resolvePath('/qux', './qux/quux/quuux/./')).toBe('/qux/qux/quux/quuux');
        expect(resolvePath('/qux', './qux/quux/quuux/..')).toBe('/qux/qux/quux');
        expect(resolvePath('/qux', './qux/quux/quuux/../')).toBe('/qux/qux/quux');
        expect(resolvePath('/qux', './qux/../quux///quuux/./')).toBe('/qux/quux/quuux');
        expect(resolvePath('/qux', './qux/../quux///quuux//.././././///////./')).toBe('/qux/quux');
        expect(resolvePath('/qux', './qux/../quux///quuux//.././././///////./.')).toBe('/qux/quux');
        expect(resolvePath('/qux', '././qux/../quux///quuux//.././././///////./.')).toBe('/qux/quux');
        expect(resolvePath('/qux', './qux/../quux///quuux//.././././///////./..')).toBe('/qux'); 

        expect(resolvePath('/qux', '../')).toBe('');
        expect(resolvePath('/qux', '../qux')).toBe('/qux');
        expect(resolvePath('/qux', './qux/../quux/../.././quuux')).toBe('/quuux');
        expect(resolvePath('/qux', './qux/quux/../.././../quuux/..')).toBe('');
      });

    it('absolute dir value with identical first two segments', () =>
      // prettier-ignore
      {
        expect(resolvePath('/qux/quux', './')).toBe('/qux/quux');
        expect(resolvePath('/qux/quux', './qux')).toBe('/qux/quux/qux');
        expect(resolvePath('/qux/quux', './qux/quux')).toBe('/qux/quux/qux/quux');
        expect(resolvePath('/qux/quux', './qux/quux/quuux')).toBe('/qux/quux/qux/quux/quuux');
        expect(resolvePath('/qux/quux', './qux/./quux/quuux')).toBe('/qux/quux/qux/quux/quuux');
        expect(resolvePath('/qux/quux', './qux/../quux/quuux')).toBe('/qux/quux/quux/quuux');
        expect(resolvePath('/qux/quux', './qux/quux/quuux/.')).toBe('/qux/quux/qux/quux/quuux');
        expect(resolvePath('/qux/quux', './qux/quux/quuux/./')).toBe('/qux/quux/qux/quux/quuux');
        expect(resolvePath('/qux/quux', './qux/quux/quuux/..')).toBe('/qux/quux/qux/quux');
        expect(resolvePath('/qux/quux', './qux/quux/quuux/../')).toBe('/qux/quux/qux/quux');
        expect(resolvePath('/qux/quux', './qux/../quux///quuux/./')).toBe('/qux/quux/quux/quuux');
        expect(resolvePath('/qux/quux', './qux/../quux///quuux//.././././///////./')).toBe('/qux/quux/quux');
        expect(resolvePath('/qux/quux', './qux/../quux///quuux//.././././///////./.')).toBe('/qux/quux/quux');
        expect(resolvePath('/qux/quux', '././qux/../quux///quuux//.././././///////./.')).toBe('/qux/quux/quux');
        expect(resolvePath('/qux/quux', './qux/../quux///quuux//.././././///////./..')).toBe('/qux/quux'); 

        expect(resolvePath('/qux/quux', '../')).toBe('/qux');
        expect(resolvePath('/qux/quux', '../qux')).toBe('/qux/qux');
        expect(resolvePath('/qux/quux', './qux/../quux/../.././quuux')).toBe('/qux/quuux');
        expect(resolvePath('/qux/quux', './qux/quux/../.././../quuux/..')).toBe('/qux');
      });
  });
});
