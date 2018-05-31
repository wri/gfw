export const initialState = {
  title: {
    withLocation: 'Tree cover loss in {location} compared to other areas'
  },
  config: {
    size: 'small',
    forestTypes: ['ifl_2013', 'plantations', 'primary_forest'],
    landCategories: ['mining', 'wdpa', 'landmark'],
    units: ['ha', '%'],
    categories: ['forest-change'],
    admins: ['country'],
    selectors: [
      'forestTypes',
      'landCategories',
      'thresholds',
      'extentYears',
      'units',
      'startYears',
      'endYears'
    ],
    type: 'loss',
    metaKey: 'widget_tree_cover_loss_ranking',
    layers: ['loss'],
    sortOrder: {
      summary: 5,
      forestChange: 4
    },
    sentences: {
      initial:
        'From {startYear} to {endYear}, {location} lost {loss} of tree cover {indicator}, equivalent to a {percent} decrease since {extentYear} and {globalPercent} of global tree cover loss.',
      withIndicator:
        'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}, equivalent to a {percent} decrease since {extentYear} and {globalPercent} of global tree cover loss.',
      noLoss: 'There was no tree cover loss identified in {location}.'
    }
  },
  settings: {
    threshold: 50,
    startYear: 2001,
    endYear: 2016,
    unit: '%',
    extentYear: 2000,
    layers: ['loss']
  },
  enabled: true
};
