export default {
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
      initial:
        'As of {year}, {location} had {value} of tree cover, representing {percentage} of the total land area.',
      withIndicator:
        'As of {year}, {location} had {percentage} tree cover was in {indicator}.'
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
