export function translateText(str, params) {
  const { Transifex } = window;
  if (typeof Transifex !== 'undefined' && str) {
    return Transifex.live.translateText(str, params);
  }
  if (str !== 0) {
    console.warn(
      'Attempted translation before transifex finished loading:',
      str
    );
  }
  return str;
}
