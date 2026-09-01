import { isValidMetadataPath } from 'utils/metadata';

describe('isValidMetadataPath', () => {
  it.each([
    'umd_tree_cover_loss',
    'widget_tree_cover_loss',
    'foo-bar',
    'foo/bar',
  ])('accepts safe metadata path %s', (path) => {
    expect(isValidMetadataPath(path)).toBe(true);
  });

  it.each(['../foo', 'foo?bar=baz', 'foo bar', '', null, undefined])(
    'rejects unsafe metadata path %s',
    (path) => {
      expect(isValidMetadataPath(path)).toBe(false);
    }
  );
});
