export default {
  widget: 'whrc-biomass',
  title: 'Biomass density in {location}',
  categories: ['climate'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  options: {
    thresholds: true,
    variables: ['totalbiomass', 'biomassdensity']
  },
  colors: 'climate',
  dataType: 'loss',
  metaKey: 'aboveground_biomass',
  layers: ['f10bded4-94e2-40b6-8602-ae5bdfc07c08'],
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentences: {
    initial:
      'In 2000, {location} had a biomass density of {biomassDensity}, and a total biomass of {totalBiomass}.',
    totalbiomass:
      'Around {value} of the world’s {label} is contained in the top 5 countries.',
    biomassdensity:
      'The average {label} of the world’s top 5 countries is {value}.'
  }
};
