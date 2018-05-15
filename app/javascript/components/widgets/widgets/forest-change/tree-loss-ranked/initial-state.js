export const initialState = {
  title: 'Tree cover loss',
  config: {
    size: 'small',
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
    units: ['ha', '%'],
    categories: ['forest-change'],
    admins: ['country'],
    selectors: [
      'indicators',
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
      forestChange: 3
    },
    sentences: {
      initial:
        'From {startYear} to {endYear}, {location} lost {loss} of tree cover {indicator}, equivalent to a {percent} decrease since {extentYear} and {globalPercent} of global tree cover loss.',
      withIndicator:
        'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}, equivalent to a {percent} decrease since {extentYear} and {globalPercent} of global tree cover gain within {indicator_alt}.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 50,
    startYear: 2001,
    endYear: 2016,
    unit: '%',
    extentYear: 2000,
    layers: ['loss']
  },
  enabled: true
};
