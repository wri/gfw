export const initialState = {
  title: 'Primary forest extent',
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
      initial: 'In {location}, {percentage} of tree cover is {primary}.',
      lessThan:
        'In {location}, less than {percentage} of tree cover is {primary}.',
      withIndicator:
        'Within {indicator} in {location}, {percentage} of tree cover is {primary}.',
      lessThanWithIndicator:
        'Within {indicator} in {location}, less than {percentage} of tree cover is {primary}.'
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
