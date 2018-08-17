export const initialState = {
  title: {
    global: 'Global Tree cover loss',
    withLocation: 'Tree cover loss in {location} compared to other areas'
  },
  config: {
    size: 'small',
    forestTypes: ['ifl'],
    units: ['ha', '%'],
    categories: ['forest-change'],
    admins: ['global', 'country'],
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
      globalInitial:
        'From {startYear} to {endYear}, {loss} of tree cover was lost {location}, equivalent to a {localPercent} decrease since {extentYear}.',
      globalWithIndicator:
        'From {startYear} to {endYear}, {loss} of tree cover was lost {location}, within {indicator} equivalent to a {localPercent} decrease since {extentYear}',
      initial:
        'From {startYear} to {endYear}, {location} lost {loss} of tree cover, equivalent to a {localPercent} decrease since {extentYear} and {globalPercent} of the global total.',
      withIndicator:
        'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}, equivalent to a {localPercent} decrease since {extentYear} and {globalPercent} of the global total.',
      noLoss: 'There was no tree cover loss identified in {location}.'
    }
  },
  settings: {
    threshold: 30,
    startYear: 2001,
    endYear: 2017,
    unit: '%',
    extentYear: 2000,
    layers: ['loss'],
    pageSize: 5,
    page: 0
  },
  enabled: true
};
