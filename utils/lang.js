const googleLangCode = {
  es_MX: 'es',
  en: 'en',
  zh: 'zh-CH',
  pt_BR: 'pt',
  fr: 'fr',
  id: 'id',
};

const momentLangCode = {
  es_MX: 'es',
  en: 'en',
  zh: 'zh-cn',
  pt_BR: 'pt-br',
  fr: 'fr',
  id: 'id',
};

export const getLanguages = () => [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: '中文',
    value: 'zh',
  },
  {
    label: 'Français',
    value: 'fr',
  },
  {
    label: 'Bahasa Indonesia',
    value: 'id',
  },
  {
    label: 'Português (Brasil)',
    value: 'pt_BR',
  },
  {
    label: 'Español (Mexico)',
    value: 'es_MX',
  },
];

export const getGoogleLangCode = (lang) => googleLangCode[lang || 'en'];
export const getMomentLangCode = (lang) => momentLangCode[lang || 'en'];
