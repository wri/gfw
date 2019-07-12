export function translateText(str, params) {
  const { Transifex } = window;
  if (typeof Transifex !== 'undefined' && str) {
    return Transifex.live.translateText(str, params);
  }
  console.warn('Attempted translation before transifex finished loading:', str);
  return str;
}

export function translateNode(node) {
  const { Transifex } = window;
  if (typeof Transifex !== 'undefined' && node) {
    return Transifex.live.translateNode(node);
  }
  return node;
}
