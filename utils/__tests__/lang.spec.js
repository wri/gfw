import {
  languages,
  getGoogleLangCode,
  getMomentLangCode,
  getMapboxLang,
  translateText,
} from '../lang';

describe('utils/lang', () => {
  it('exposes known language options', () => {
    const values = languages.map((l) => l.value);
    expect(values).toEqual(
      expect.arrayContaining(['en', 'zh', 'pt_BR', 'es_MX'])
    );
  });

  it('maps language codes for Google, moment and Mapbox', () => {
    expect(getGoogleLangCode('pt_BR')).toBe('pt');
    expect(getMomentLangCode('zh')).toBe('zh-cn');
    expect(getMapboxLang('id')).toBe('en');
  });

  it('falls back to original string if Transifex is not available', () => {
    const text = 'Hello';
    expect(translateText(text)).toBe(text);
  });

  it('uses Transifex live when available on window', () => {
    const original = 'Hello';
    const mockTranslate = jest.fn(() => 'translated');

    // eslint-disable-next-line no-undef
    window.Transifex = {
      live: {
        translateText: mockTranslate,
      },
    };

    const result = translateText(original);

    expect(mockTranslate).toHaveBeenCalledWith(original, undefined);
    expect(result).toBe('translated');
  });
});
