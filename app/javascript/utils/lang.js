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

export const getLanguages = () => {
  if (typeof window !== 'undefined') {
    const txData = JSON.parse(localStorage.getItem('txlive:languages'));
    return (
      txData &&
      txData.source &&
      [txData.source].concat(txData.translation).map((l) => ({
        label: l.name,
        value: l.code,
      }))
    );
  }
  return false;
};

export const selectActiveLang = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('txlive:selectedLang'));
  }

  return 'en';
};

export const getGoogleLangCode = (lang) => googleLangCode[lang || 'en'];
export const getMomentLangCode = (lang) => momentLangCode[lang || 'en'];
