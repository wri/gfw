export const initialState = {
  title: 'Tree cover extent',
  config: {
    size: 'small',
    indicators: ['gadm28', 'mining', 'landmark', 'wdpa'],
    categories: ['summary', 'land-cover'],
    admins: ['country', 'region', 'subRegion'],
    selectors: ['indicators', 'thresholds', 'extentYears'],
    type: 'extent',
    metaKey: 'widget_tree_cover',
    layers: ['forest2000', 'forest2010'],
    sortOrder: {
      summary: 1,
      landCover: 1
    },
    sentences: {
      initial: 'As of {year}, {location} had {value} of tree cover.',
      withIndicator:
        'As of {year}, {indicator} in {location} had {value} of tree cover.'
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
