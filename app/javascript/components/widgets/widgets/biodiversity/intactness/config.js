export default {
  widget: 'intactness',
  title: 'Biodiversity Status',
  categories: ['biodiversity'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1'],
  large: true,
  analysis: false,
  /* options: {
    forestTypes: ['ifl', 'primary_forest', 'mangrove_2010_gmw'],
    landCategories: true,
    startYears: true,
    endYears: true,
    thresholds: true,
    extentYears: true
  }, */
  colors: 'loss',
  dataType: 'loss',
  // metaKey: 'widget_tree_cover_loss',
  // layers: ['loss', 'c3075c5a-5567-4b09-bc0d-96ed1673f8b6'],
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentence: {
    initial:
      'In {location}, around {percent} of regions have a {percentile} degree of {variable}'
  }
};
