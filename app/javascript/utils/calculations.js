export const tonsToTonnes = value => value * 0.907185;

export const biomassToCO2 = value => (value + 0.489 * value ** 0.89) * 0.47;

export const biomassToC = value => value + 0.489 * value ** 0.89;

export function ordinalSuffixOf(i) {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return `${i}st`;
  }
  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }
  return `${i}th`;
}
