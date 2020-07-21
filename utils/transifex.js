export function translateText(str, params) {
  if (!str || typeof str !== 'string') {
    return str;
  }

  if (typeof window !== 'undefined') {
    const { Transifex } = window;
    if (typeof Transifex !== 'undefined') {
      return Transifex.live.translateText(str, params);
    }
  }

  console.warn('Attempted translation before transifex finished loading:', str);

  return str;
}
