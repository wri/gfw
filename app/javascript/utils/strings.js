export const pluralise = str =>
  (str.substr(-1) === 'y' ? `${str.substr(0, str.length - 1)}ies` : `${str}s`);
