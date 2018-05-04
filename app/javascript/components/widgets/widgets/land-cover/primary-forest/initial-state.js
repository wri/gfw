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
    customLocationWhitelist: ['IDN', 'COD'],
    selectors: ['indicators', 'thresholds'],
    type: 'extent',
    metaKey: 'widget_primary_forest',
    layers: ['forest2000'],
    sortOrder: {
      landCover: 4
    },
    sentences: {
      initial: 'In {location}, {primary} covers {percentage} of the land area.',
      lessThan:
        'In {location}, {primary} covers less than {percentage} of the land area.',
      withIndicator:
        'Within {indicator} in {location}, {primary} covers {percentage} of the land area.',
      lessThanWithIndicator:
        'Within {indicator} in {location}, {primary} covers less than {percentage} of the land area.'
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
