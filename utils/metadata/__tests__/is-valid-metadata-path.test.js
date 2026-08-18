import { isValidMetadataPath } from '../is-valid-metadata-path';

describe('isValidMetadataPath', () => {
  it.each([
    'umd_tree_cover_loss',
    'widget_tree_cover_loss',
    'foo/bar',
    'foo-bar',
  ])('accepts a valid path: %s', (path) => {
    expect(isValidMetadataPath(path)).toBe(true);
  });

  it.each([
    '../foo',
    'foo?bar',
    '..%2Ffoo', // encoded traversal attempt
    'foo bar', // whitespace
    'foo.bar', // unsupported character
    '',
  ])('rejects an unsafe or malformed path: %s', (path) => {
    expect(isValidMetadataPath(path)).toBe(false);
  });

  it('rejects non-string input', () => {
    expect(isValidMetadataPath(undefined)).toBe(false);
    expect(isValidMetadataPath(null)).toBe(false);
  });
});
