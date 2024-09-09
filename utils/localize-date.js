import dateFnsformat from 'date-fns/format';
import { enUS, es, ptBR, zhCN, fr, id } from 'date-fns/locale';

// TX language codes (set in localStorage) mapping to ISO codes that date-fns uses for locales
export const TX_LANGUAGE_TO_DATEFNS_LOCALE_MAPPING = {
  en: enUS,
  zh: zhCN,
  fr,
  id,
  pt_BR: ptBR,
  es_MX: es,
};

// General localization function
export const localizeDate = (date, lang = 'en', format = 'PP') => {
  const dateFnsLocale = TX_LANGUAGE_TO_DATEFNS_LOCALE_MAPPING[lang];

  // Format the date.
  const localizedDate = dateFnsformat(new Date(date), format, {
    locale: dateFnsLocale,
  });

  return localizedDate;
};

// Localization function specific for widgets' sentences
export const localizeWidgetSentenceDate = (date, lang = 'en') => {
  const DATE_FORMAT_MAPPING = {
    en: "do 'of' LLLL yyyy",
    zh: "do LLLL yyyy",
    fr: "do LLLL yyyy",
    id: "do LLLL yyyy",
    pt_BR: "d 'de' LLLL 'de' yyyy",
    es_MX: "d 'de' LLLL 'de' yyyy",
  };

  const format = DATE_FORMAT_MAPPING[lang];
  const localizedDate = localizeDate(date, lang, format);

  return localizedDate;
}
