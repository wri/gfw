export const initialState = {
  title: {
    withLocation: 'Tree cover loss in {location}'
  },
  config: {
    size: 'large',
    forestTypes: ['ifl', 'primary_forest', 'mangrove_2010_gmw'],
    categories: ['summary', 'forest-change'],
    admins: ['country', 'region', 'subRegion'],
    selectors: [
      'forestTypes',
      'landCategories',
      'startYears',
      'endYears',
      'thresholds',
      'extentYears'
    ],
    type: 'loss',
    metaKey: 'widget_tree_cover_loss',
    layers: ['loss'],
    sortOrder: {
      summary: 0,
      forestChange: 0
    },
    sentences: {
      initial:
        'From {startYear} to {endYear}, {location} lost {loss} of tree cover, equivalent to a {percent} decrease since {extentYear} and {emissions} of CO\u2082 emissions.',
      withIndicator:
        'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}, equivalent to a {percent} decrease since {extentYear} and {emissions} of CO\u2082 emissions.',
      noLoss:
        'From {startYear} to {endYear}, {location} lost {loss} of tree cover.',
      noLossWithIndicator:
        'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}.'
    }
  },
  settings: {
    threshold: 30,
    startYear: 2001,
    endYear: 2017,
    extentYear: 2000,
    layers: ['loss']
  },
  enabled: true
};
