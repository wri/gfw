/**
  * @function Sentence
  * @desc Template literal for supplying a widget sentence;
  *        with verbose matching of variables, so we can match the actual template string
  * @param parts $string - sentence to parse
  * @example Sentence`My {sentence} here`
  *          where {sentence} will turn to a verbose expression
  * @return regexp instance used for testing sentences
*/
export function Sentence(parts) {
  const words = parts[0].split(' ');
  return new RegExp(words.map(w => {
    if (w.match(/{([^\s]+)}/)) {
      return '([^\\s]+)';
    }
    return w;
  }).join(' ').replace(/[*|.]/g, '\\$&'));
}
