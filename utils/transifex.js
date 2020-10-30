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

  return str;
}
