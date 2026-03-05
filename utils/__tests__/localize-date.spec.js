import {
  TX_LANGUAGE_TO_DATEFNS_LOCALE_MAPPING,
  localizeDate,
  localizeWidgetSentenceDate,
} from '../localize-date';

describe('utils/localize-date', () => {
  it('maps known TX language codes to date-fns locales', () => {
    expect(TX_LANGUAGE_TO_DATEFNS_LOCALE_MAPPING.en).toBeDefined();
    expect(TX_LANGUAGE_TO_DATEFNS_LOCALE_MAPPING.pt_BR).toBeDefined();
  });

  it('formats dates using localizeDate with explicit format', () => {
    const formatted = localizeDate('2024-01-15', 'en', 'yyyy-MM-dd');
    expect(formatted).toBe('2024-01-15');
  });

  it('formats widget sentence dates with language-specific patterns', () => {
    const formattedEn = localizeWidgetSentenceDate('2024-01-15', 'en');
    expect(formattedEn).toContain('January');
    expect(formattedEn).toContain('2024');

    const formattedPt = localizeWidgetSentenceDate('2024-01-15', 'pt_BR');
    expect(formattedPt).toContain('2024');
  });
});
