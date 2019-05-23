export default {
  widget: 'soilOrganic',
  title: {
    default: 'Soil organic carbon in {location}',
    global: 'Global soil organic carbon'
  },
  categories: ['climate'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  options: {
    variables: ['totalbiomass', 'biomassdensity']
  },
  datasets: [
    // soil organis carbon
    {
      dataset: '55eec37b-e491-447f-b0d2-b8d5b7acdaf7',
      layers: ['2c4fde29-1627-40eb-96b5-a9e388f7c7b7']
    }
  ],
  analysis: true,
  colors: 'climate',
  metaKey: 'soil_organic_carbon',
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentences: {
    initial:
      'In 2000, {location} had a soil organic carbon density of {biomassDensity}, and a total carbon storage of {totalBiomass}.'
  }
};
