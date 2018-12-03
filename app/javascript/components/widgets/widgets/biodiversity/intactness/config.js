export default {
  widget: 'intactness',
  title: 'Biodiversity Status',
  categories: ['biodiversity'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1'],
  large: true,
  analysis: false,
  options: {
    bTypes: true
  },
  colors: 'biodiversity',
  dataType: 'loss',
  // metaKey: 'widget_tree_cover_loss',
  // layers: ['loss', 'c3075c5a-5567-4b09-bc0d-96ed1673f8b6'],
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentence: {
    initial:
      'Around {percent} of {location} has a {percentile} degree of biodiversity {variable}.'
  }
};
