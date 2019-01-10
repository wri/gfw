export default {
  widget: 'whrc-biomass',
  title: 'Biomass density in {location}',
  categories: ['climate'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    thresholds: true,
    variables: ['total', 'density']
  },
  colors: 'emissions',
  dataType: 'loss',
  metaKey: 'whrc-biomass',
  layers: ['loss', 'c3075c5a-5567-4b09-bc0d-96ed1673f8b6'],
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentence:
    'In 2000, {location} had a biomass density of {biomassDensity}, and a total biomass of {totalBiomass}.'
};
