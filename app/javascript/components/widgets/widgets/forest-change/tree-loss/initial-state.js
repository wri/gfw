export const initialState = {
  title: 'Tree cover loss',
  config: {
    size: 'large',
    indicators: [
      'gadm28',
      'ifl_2013',
      'mining',
      'wdpa',
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
      summary: 1,
      forestChange: 1
    },
    sentences: {
      initial:
        'From {startYear} and {endYear}, {location} lost {loss} of tree cover, equivalent to a {percent} decrease since {extentYear} and {emissions} of CO\u2082 emissions.',
      withIndicator:
        'From {startYear} and {endYear}, {location} lost {loss} of tree cover in {indicator}, equivalent to a {percent} decrease since {extentYear} and {emissions} of CO\u2082 emissions.',
      noLoss:
        'From {startYear} and {endYear}, {location} lost {loss} of tree cover.',
      noLossWithIndicator:
        'From {startYear} and {endYear}, {location} lost {loss} of tree cover in {indicator}.'
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
