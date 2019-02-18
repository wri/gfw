export default {
  widget: 'soil-organic',
  title: 'Soil organic carbon in {location}',
  categories: ['climate'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  options: {
    variables: ['totalbiomass', 'biomassdensity']
  },
  colors: 'climate',
  metaKey: 'soil_organic_carbon',
  // layers: ['2c4fde29-1627-40eb-96b5-a9e388f7c7b7'],
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentences: {
    initial:
      'In 2000, {location} had a soil organic carbon density of {biomassDensity}, and a total carbon storage of {totalBiomass}.'
  }
};
