export default {
  widget: 'intactness',
  title: 'Biodiversity Status',
  categories: ['biodiversity'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1'],
  large: true,
  analysis: false,
  options: {
    bioTypes: true
  },
  colors: 'biodiversity',
  dataType: 'biodiversity',
  metaKey: 'biodiversity_intactness',
  layers: [
    '43a205fe-aad3-4db1-8807-c399a3264349',
    'f13f86cb-08b5-4e6c-bb8d-b4782052f9e5'
  ],
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentence: {
    initial:
      'Around {percent} of {location} has a {percentile} degree of biodiversity {variable}.'
  }
};
