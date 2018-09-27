export const pluralise = str => {
  if (str.substr(-1) === 's') return str;
  return str.substr(-1) === 'y' && str.substr(-1) !== 's' ? `${str.substr(0, str.length - 1)}ies` : `${str}s`;
};

export const getIndicator = (forestType, landCategory) => {
  if (landCategory && !forestType) {
    return landCategory;
  } else if (landCategory && forestType) {
    return `${forestType}__${landCategory}`;
  } else if (!landCategory && forestType) {
    return forestType;
  }
  return 'admin';
};
