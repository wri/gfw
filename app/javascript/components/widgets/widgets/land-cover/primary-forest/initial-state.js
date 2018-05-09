export default {
  title: 'Primary forest',
  config: {
    size: 'small',
    indicators: [
      'primary_forest',
      'primary_forest__mining',
      'primary_forest__wdpa',
      'primary_forest__landmark'
    ],
    categories: ['land-cover'],
    admins: ['country', 'region', 'subRegion'],
    locationWhitelist: ['IDN', 'COD'],
    selectors: ['indicators', 'thresholds'],
    type: 'extent',
    metaKey: 'widget_primary_forest',
    layers: ['forest2000'],
    sortOrder: {
      landCover: 4
    },
    sentences: {
      initial:
        'As of {extentYear}, {percentage} of {location} total tree cover was {primary}.',
      withIndicator:
        'As of {extentYear}, {percentage} of {location} total tree cover was {primary} within {indicator}.'
    }
  },
  settings: {
    indicator: 'primary_forest',
    threshold: 30,
    extentYear: 2000,
    layers: ['forest2000']
  },
  enabled: true
};
