export default {
  title: 'Intact forest',
  config: {
    size: 'small',
    indicators: [
      'ifl_2013',
      'ifl_2013__wdpa',
      'ifl_2013__mining',
      'ifl_2013__landmark'
    ],
    categories: ['land-cover'],
    admins: ['global', 'country', 'region', 'subRegion'],
    selectors: ['indicators', 'thresholds'],
    type: 'extent',
    metaKey: 'widget_ifl',
    layers: ['forest2000', 'forest2010', 'ifl_2013_deg'],
    sortOrder: {
      landCover: 3
    },
    sentences: {
      globalInitial:
        'As of 2013, {percentage} of {location} tree cover is {intact}.',
      globalWithIndicator:
        'As of 2013, {percentage} of {location} tree cover within {indicator} is {intact}.',
      initial: 'In {location}, {percentage} of tree cover is {intact}.',
      withIndicator:
        'Within {indicator} in {location}, {percentage} of tree cover is {intact}.'
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
