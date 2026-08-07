import urlParam from '../url-param';
import {
  decodeQueryParams,
  encodeQueryParams,
  ObjectToQueryString,
  resolveModalMeta,
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

  describe('resolveModalMeta', () => {
    it('returns undefined when no modalMeta is given', () => {
      expect(resolveModalMeta(undefined)).toBeUndefined();
      expect(resolveModalMeta('')).toBeUndefined();
      expect(resolveModalMeta(null)).toBeUndefined();
    });

    it('passes through the current { metakey, metaType } shape unchanged', () => {
      const modalMeta = {
        metakey: 'widget_tree_cover_loss',
        metaType: 'widget',
      };
      expect(resolveModalMeta(modalMeta)).toEqual(modalMeta);
    });

    it('infers metaType "widget" for legacy widget_-prefixed string keys', () => {
      expect(resolveModalMeta('widget_tree_cover_loss')).toEqual({
        metakey: 'widget_tree_cover_loss',
        metaType: 'widget',
      });
    });

    it('infers metaType "layer" for legacy string keys without the widget_ prefix', () => {
      expect(resolveModalMeta('flagship_basemaps')).toEqual({
        metakey: 'flagship_basemaps',
        metaType: 'layer',
      });
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
