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
    yearRange: ['2013', '2016'],
    type: 'loss',
    metaKey: 'widget_plantations_tree_cover_loss',
    layers: ['loss', 'plantations_by_type'],
    sortOrder: {
      forestChange: 2
    },
    sentences: {
      initial:
        'The majority of tree cover loss in {location} from {startYear} to {endYear} occured within {lossPhrase}. The total loss within natural forest was equivalent to {value}.'
    }
  },
  settings: {
    threshold: 30,
    startYear: 2013,
    endYear: 2016,
    layers: ['loss', 'plantations_by_type']
  },
  enabled: true
};
