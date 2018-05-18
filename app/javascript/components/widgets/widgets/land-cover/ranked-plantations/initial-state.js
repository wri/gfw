export default {
  title: 'Location of plantations',
  config: {
    size: 'small',
    categories: ['land-cover'],
    admins: ['country', 'region'],
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
