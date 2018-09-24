export default {
  widget: 'primaryForest',
  title: 'Primary forest in {location}',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    landCategories: true,
    thresholds: true
  },
  colors: 'extent',
  metaKey: 'widget_primary_forest',
  layers: ['forest2000'],
  sortOrder: {
    landCover: 4
  },
  sentences: {
    initial:
      'As of {extentYear}, {percentage} of {location} total tree cover was <b>primary forest</b>.',
    withIndicator:
      'As of {extentYear}, {percentage} of {location} total tree cover in {indicator} was <b>primary forest</b>.'
  },
  whitelists: {
    adm0: ['IDN', 'COD']
  }
};
