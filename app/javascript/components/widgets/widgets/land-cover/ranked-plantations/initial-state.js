export default {
  title: {
    withLocation: 'Location of plantations in {location}'
  },
  config: {
    size: 'small',
    categories: ['land-cover'],
    admins: ['country', 'region'],
    showIndicators: ['plantations'],
    selectors: ['types'],
    type: 'plantations',
    metaKey: 'widget_plantations_ranked',
    layers: ['plantations_by_type', 'plantations_by_species'],
    sortOrder: {
      landCover: 101
    },
    sentences: {
      initial:
        '{region} has the largest relative plantation area in {location} at {percentage}, most of which is in {topType}.'
    }
  },
  settings: {
    threshold: 0,
    type: 'bound2',
    pageSize: 5,
    page: 0,
    layers: ['plantations_by_species']
  },
  enabled: true
};
