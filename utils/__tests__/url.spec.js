import urlParam from '../url-param';
import {
  decodeQueryParams,
  encodeQueryParams,
  ObjectToQueryString,
} from '../url';

describe('utils/url', () => {
  describe('encodeQueryParams', () => {
    it('encodes object params with base64 and keeps primitive params', () => {
      const params = {
        page: 2,
        filters: { foo: 'bar' },
        empty: null,
      };

      const qs = encodeQueryParams(params);

      expect(qs).toContain('page=2');
      expect(qs).toMatch(/filters=[A-Za-z0-9+/=]+/);
      expect(qs).not.toContain('empty=');
    });
  });

  describe('decodeQueryParams', () => {
    it('decodes base64-encoded JSON params using urlParam', () => {
      const original = { foo: 'bar', value: 1 };
      const encoded = urlParam.encode(original);

      const decoded = decodeQueryParams({ filters: encoded });

      expect(decoded.filters).toEqual(original);
    });

    it('falls back to JSON.parse and raw value when decode fails', () => {
      const decoded = decodeQueryParams({
        json: JSON.stringify({ a: 1 }),
        plain: 'value',
      });

      expect(decoded.json).toEqual({ a: 1 });
      expect(decoded.plain).toBe('value');
    });
  });

  describe('ObjectToQueryString', () => {
    it('returns empty string for empty params', () => {
      expect(ObjectToQueryString({})).toBe('');
      expect(ObjectToQueryString(null)).toBe('');
    });

    it('serializes a simple object to a query string', () => {
      const qs = ObjectToQueryString({ foo: 'bar', page: 1 });
      expect(qs[0]).toBe('?');
      expect(qs).toContain('foo=bar');
      expect(qs).toContain('page=1');
    });
  });
});
