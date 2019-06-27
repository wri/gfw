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
    thresholds: true,
    units: ['co2LossByYear', 'cLossByYear']
  },
  datasets: [
    // biomass loss
    {
      dataset: 'a9cc6ec0-5c1c-4e36-9b26-b4ee0b50587b',
      layers: ['b32a2f15-25e8-4ecc-98e0-68782ab1c0fe']
    }
  ],
  analysis: true,
  colors: 'climate',
  metaKey: 'tree_biomass_loss',
  sortOrder: {
    climate: 3
  },
  sentences: {
    initial:
      'From {startYear} to {endYear}, a total of {emissions} of {variable} emissions were released from tree cover loss in {location} natural forests.'
  },
  whitelists: {
    indicators: ['plantations']
  }
};
