import isEmpty from 'lodash/isEmpty';

export const adminSentences = {
  default:
    'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area.',
  withLoss:
    'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover',
  globalInitial:
    'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover.',
  withPlantationLoss:
    'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest',
  countrySpecific: {
    IDN:
      'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions.',
  },
  co2Emissions: ', equivalent to {emissions} of CO\u2082 of emissions.',
  end: '.',
};

export const getContextSentence = (location, geodescriber, adminSentence) => {
  if (isEmpty(geodescriber)) return {};

  // if not an admin we can use geodescriber
  if (!['global', 'country'].includes(location.type)) {
    return {
      sentence: geodescriber.description,
      params: geodescriber.description_params,
    };
  }

  // if an admin we needs to calculate the params
  return adminSentence;
}

export const parseSentence = (location, geodescriber, adminSentence) => {
  if (location === 'global') {
    return 'global';
  }
  const context = getContextSentence(location, geodescriber, adminSentence);
  return null;
}
