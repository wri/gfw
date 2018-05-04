export default {
  title: 'Intact forest extent',
  config: {
    size: 'small',
    indicators: [
      'ifl_2013',
      'ifl_2013__wdpa',
      'ifl_2013__mining',
      'ifl_2013__landmark'
    ],
    categories: ['land-cover'],
    admins: ['country', 'region', 'subRegion'],
    selectors: ['indicators', 'thresholds'],
    type: 'extent',
    metaKey: 'widget_ifl',
    layers: ['forest2000', 'forest2010', 'ifl_2013_deg'],
    sortOrder: {
      landCover: 3
    },
    sentences: {
      initial: 'In {location}, {intact} covers {percentage} of the land area.',
      lessThan:
        'In {location}, {intact} covers less than {percentage} of the land area.',
      withIndicator:
        'Within {indicator} in {location}, {intact} covers {percentage} of the land area.',
      lessThanWithIndicator:
        'Within {indicator} in {location}, {intact} covers less than {percentage} of the land area.'
    }
  },
  settings: {
    indicator: 'ifl_2013',
    threshold: 30,
    extentYear: 2010,
    layers: ['forest2010', 'ifl_2013_deg']
  },
  enabled: true
};
