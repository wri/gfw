export const initialState = {
  title: 'Tree cover loss',
  config: {
    size: 'large',
    indicators: [
      'gadm28',
      'ifl_2013',
      'mining',
      'wdpa',
      'plantations',
      'landmark',
      'primary_forest',
      'ifl_2013',
      'ifl_2013__wdpa',
      'ifl_2013__mining',
      'ifl_2013__landmark',
      'primary_forest',
      'primary_forest__mining',
      'primary_forest__wdpa',
      'primary_forest__landmark',
      'plantations__mining',
      'plantations__wdpa',
      'plantations__landmark'
    ],
    categories: ['summary', 'forest-change'],
    admins: ['country', 'region', 'subRegion'],
    selectors: [
      'indicators',
      'startYears',
      'endYears',
      'thresholds',
      'extentYears'
    ],
    type: 'loss',
    metaKey: 'widget_tree_cover_loss',
    layers: ['loss'],
    sortOrder: {
      summary: 3,
      forestChange: 1
    },
    sentences: {
      initial:
        "Between {startYear} and {endYear}, {location} lost {loss} of tree cover. This loss is equal to {percent} of the area's tree cover extent in {extentYear}, and equivalent to {emissions} of of CO\u2082 emissions.",
      withIndicator:
        "Between {startYear} and {endYear}, {indicator} in {location} lost {loss} of tree cover. This loss is equal to {percent} of the area's tree cover extent in {extentYear}, and equivalent to {emissions} of of CO\u2082 emissions.",
      noLoss:
        'Between {startYear} and {endYear}, {location} lost {loss} of tree cover.',
      noLossWithIndicator:
        'Between {startYear} and {endYear}, {indicator} in {location} lost {loss} of tree cover.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30,
    startYear: 2001,
    endYear: 2016,
    extentYear: 2000,
    layers: ['loss']
  },
  enabled: true
};
