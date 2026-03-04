import urlParam from '../url-param';

describe('utils/url-param', () => {
  it('encodes and decodes objects with unicode characters', () => {
    const original = {
      name: 'Bình Thuận',
      value: 123,
    };

    const encoded = urlParam.encode(original);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = urlParam.decode(encoded);
    expect(decoded).toEqual(original);
  });
});
