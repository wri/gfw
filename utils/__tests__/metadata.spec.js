import { isValidMetadataKey, isValidMetadataPath } from 'utils/metadata';

describe('isValidMetadataKey', () => {
  it.each(['umd_tree_cover_loss', 'widget_tree_cover_loss', 'foo-bar'])(
    'accepts safe metadata key %s',
    (key) => {
      expect(isValidMetadataKey(key)).toBe(true);
    }
  );

  it.each([
    'foo/bar',
    '../foo',
    'foo?bar=baz',
    'foo bar',
    '/',
    '/foo',
    'foo/',
    'foo//bar',
    '',
    null,
    undefined,
  ])('rejects invalid metadata key %s', (key) => {
    expect(isValidMetadataKey(key)).toBe(false);
  });
});

describe('isValidMetadataPath', () => {
  it.each([
    'umd_tree_cover_loss',
    'widget_tree_cover_loss',
    'foo-bar',
    'foo/bar',
  ])('accepts safe metadata path %s', (path) => {
    expect(isValidMetadataPath(path)).toBe(true);
  });

  it.each([
    '../foo',
    'foo?bar=baz',
    'foo bar',
    '/',
    '/foo',
    'foo/',
    'foo//bar',
    '',
    null,
    undefined,
  ])('rejects unsafe metadata path %s', (path) => {
    expect(isValidMetadataPath(path)).toBe(false);
  });
});
