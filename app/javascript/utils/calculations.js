export const tonsToTonnes = value => value * 0.907185;

export const biomassToCO2 = value =>
  tonsToTonnes((value + 0.489 * value ** 0.89) * 0.47);
