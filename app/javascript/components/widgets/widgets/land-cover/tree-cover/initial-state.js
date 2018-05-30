export default {
  title: {
    global: 'Global tree cover',
    withLocation: 'Tree cover in {location}'
  },
  config: {
    size: 'small',
    landCategories: ['mining', 'landmark', 'wdpa'],
    categories: ['summary', 'land-cover'],
    admins: ['global', 'country', 'region', 'subRegion'],
    selectors: ['landCategories', 'thresholds'],
    type: 'extent',
    metaKey: 'widget_tree_cover',
    layers: ['forest2000', 'forest2010'],
    sortOrder: {
      summary: 4,
      landCover: 1
    },
    sentences: {
      globalInitial:
        'As of {year}, {percentage} of {location} land cover was tree cover.',
      globalWithIndicator:
        'As of {year}, {percentage} of {location} land cover within {indicator} was tree cover.',
      initial: 'As of {year}, {location} had {value} of tree cover.',
      withIndicator:
        'As of {year}, {location} had {percentage} tree cover within {indicator}.'
    }
  },
  settings: {
    threshold: 30,
    extentYear: 2010,
    layers: ['forest2010']
  },
  enabled: true
};
