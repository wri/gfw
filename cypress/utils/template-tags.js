/**
 * @function Sentence
 * @desc Template literal for supplying a widget sentence;
 *        with verbose matching of variables, so we can match the actual template string
 * @param parts $string - sentence to parse
 * @example Sentence`My {sentence} here`
 *          where {sentence} will turn to a verbose expression
 * @return regexp instance used for testing sentences
 */
export function Sentence(parts, variables) {
  const entry =
    parts[0].length === 0 && variables.length !== 0 ? variables : parts[0];
  const words = entry
    .split(' ')
    .map((w) => {
      if (w.match(/{([^\s]+)}/)) {
        return '([\\w\\W\\s]+)';
      }
      return w;
    })
    .join(' ')
    .replace(/[*|.]/g, '\\$&');
  return new RegExp(`${words}`);
}
