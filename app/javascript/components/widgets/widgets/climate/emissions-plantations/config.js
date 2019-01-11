export default {
  widget: 'emissions-plantations',
  title: {
    initial: 'Biomass loss emissions in natural forest vs. plantations'
  },
  categories: ['climate'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    startYears: true,
    endYears: true,
    thresholds: true
  },
  colors: 'extent',
  metaKey: '',
  layers: [],
  sortOrder: {},
  sentences: {
    initial:
      'From {startYear} to {endYear}, {percentage} of tree cover loss in {location} occurred within plantations. The total loss within natural forest was equivalent to {emissions} of CO2 emissions.'
  }
};
