export function translateText(str, params) {
  if (!str || typeof str !== 'string') {
    return false;
  }

  const { Transifex } = window;
  if (typeof Transifex !== 'undefined') {
    return Transifex.live.translateText(str, params);
  }

  console.warn('Attempted translation before transifex finished loading:', str);

  return str;
}
