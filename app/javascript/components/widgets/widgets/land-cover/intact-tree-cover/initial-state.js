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
    selectors: ['indicators', 'thresholds', 'extentYears'],
    type: 'extent',
    metaKey: 'widget_ifl',
    layers: ['forest2000', 'forest2010', 'ifl_2013_deg'],
    sortOrder: {
      landCover: 3
    },
    sentences: {
      initial: 'In {location}, {percentage} of tree cover is {intact}.',
      lessThan:
        'In {location}, less than {percentage} of tree cover is {intact}.',
      withIndicator:
        'Within {indicator} in {location}, {percentage} of tree cover is {intact}.',
      lessThanWithIndicator:
        'Within {indicator} in {location}, less than {percentage} of tree cover is {intact}.'
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
