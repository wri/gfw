export default {
  title: 'Tree cover',
  config: {
    size: 'small',
    indicators: ['gadm28', 'mining', 'landmark', 'wdpa'],
    categories: ['summary', 'land-cover'],
    admins: ['country', 'region', 'subRegion'],
    selectors: ['indicators', 'thresholds'],
    type: 'extent',
    metaKey: 'widget_tree_cover',
    layers: ['forest2000', 'forest2010'],
    sortOrder: {
      summary: 4,
      landCover: 1
    },
    sentences: {
      globalInitial:
        'As of {year}, there was {value} of {location} tree cover.',
      globalWithIndicator:
        'As of {year}, there was {value} of {location} tree cover within {indicator}.',
      initial: 'As of {year}, {location} had {value} of tree cover.',
      withIndicator:
        'As of {year}, {location} had {percentage} tree cover within {indicator}.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30,
    extentYear: 2010,
    layers: ['forest2010']
  },
  enabled: true
};
