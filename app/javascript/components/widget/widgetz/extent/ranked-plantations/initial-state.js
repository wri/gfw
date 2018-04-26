export const initialState = {
  title: 'Ranked plantation breakdown',
  config: {
    size: 'small',
    categories: ['land-use'],
    admins: ['country', 'region'],
    selectors: ['types'],
    type: 'plantations',
    metaKey: 'widget_plantations_ranked',
    layers: ['plantations_by_type', 'plantations_by_species'],
    sortOrder: {
      'land-use': 2
    },
    sentences: {
      initial: ''
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 0,
    type: 'bound2',
    pageSize: 5,
    page: 0,
    layers: ['plantations_by_species']
  },
  enabled: true
};
