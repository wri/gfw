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
  layers: ['b32a2f15-25e8-4ecc-98e0-68782ab1c0fe'],
  metaKey: 'tree_biomass_loss',
  sortOrder: {},
  sentences: {
    initial:
      'From {startYear} to {endYear}, {percentage} of tree cover loss in {location} occurred within plantations. The total loss within natural forest was equivalent to {emissions} of CO₂ emissions.'
  },
  whitelists: {
    indicators: ['plantations']
  }
};
