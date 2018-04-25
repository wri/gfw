export const initialState = {
  title: 'Tree cover extent',
  config: {
    size: 'small',
    indicators: [
      'gadm28',
      'mining',
      'landmark',
      'wdpa',
      'plantations',
      'primary_forest',
      'ifl_2013'
    ],
    categories: ['summary', 'land-cover'],
    admins: ['country', 'region', 'subRegion'],
    selectors: ['indicators', 'thresholds', 'extentYears'],
    type: 'extent',
    metaKey: 'widget_tree_cover',
    layers: ['forest2000', 'forest2010'],
    sortOrder: {
      summary: 1,
      land_cover: 1
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
