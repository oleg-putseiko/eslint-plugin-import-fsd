import { resolvePath } from '../../../src/utils/path';

describe('resolvePath', () => {
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
