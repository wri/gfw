export default {
  title: 'Primary forest',
  config: {
    size: 'small',
    landCategories: ['mining', 'wdpa', 'landmark'],
    categories: ['land-cover'],
    admins: ['country', 'region', 'subRegion'],
    locationWhitelist: ['IDN', 'COD'],
    selectors: ['landCategories', 'thresholds'],
    type: 'extent',
    metaKey: 'widget_primary_forest',
    layers: ['forest2000'],
    sortOrder: {
      landCover: 4
    },
    sentences: {
      initial:
        'As of {extentYear}, {percentage} of {location} total tree cover was <b>primary forest</b>.',
      withIndicator:
        'As of {extentYear}, {percentage} of {location} total tree cover within {indicator} was <b>primary forest</b>.'
    }
  },
  settings: {
    forestType: 'primary_forest',
    threshold: 30,
    extentYear: 2010,
    layers: ['forest2000']
  },
  enabled: true
};
