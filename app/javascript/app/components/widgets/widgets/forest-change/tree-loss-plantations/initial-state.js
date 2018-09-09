export const initialState = {
  title: {
    withLocation: 'Forest loss in natural forest in {location}'
  },
  config: {
    size: 'large',
    showIndicators: ['plantations'],
    categories: ['forest-change'],
    admins: ['country', 'region', 'subRegion'],
    selectors: ['startYears', 'endYears', 'thresholds'],
    yearRange: ['2013', '2017'],
    type: 'loss',
    metaKey: 'widget_plantations_tree_cover_loss',
    layers: ['loss', 'plantations_by_type'],
    sortOrder: {
      forestChange: 2
    },
    sentences: {
      initial:
        'From {startYear} to {endYear}, {percentage} of tree cover loss in {location} occurred within {lossPhrase}. The total loss within natural forest was equivalent to {value} of CO<sub>2</sub> emissions.'
    }
  },
  settings: {
    threshold: 30,
    startYear: 2013,
    endYear: 2017,
    layers: ['loss', 'plantations_by_type']
  },
  enabled: true
};
