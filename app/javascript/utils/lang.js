const googleLangCode = {
  es_MX: 'es',
  en: 'en',
  zh: 'zh-CH',
  pt_BR: 'pt',
  fr: 'fr',
  id: 'id'
};

export const getLanguages = () => {
  const txData = JSON.parse(localStorage.getItem('txlive:languages'));
  return (
    txData &&
    txData.source &&
    [txData.source].concat(txData.translation).map(l => ({
      label: l.name,
      value: l.code
    }))
  );
};

export const getGoogleLangCode = lang => googleLangCode[lang || 'en'];
