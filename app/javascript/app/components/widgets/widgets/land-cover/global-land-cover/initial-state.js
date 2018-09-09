export default {
  title: {
    withLocation: 'Land cover for {location}'
  },
  config: {
    size: 'small',
    categories: ['land-cover'],
    admins: ['country', 'region'],
    selectors: [],
    years: [2015],
    type: 'plantations',
    metaKey: 'widget_land_cover_esa',
    sortOrder: {
      landCover: 100
    },
    sentences: {
      initial:
        'The land use of {location} in {year} is mostly {category}, covering an area of {extent}.'
    }
  },
  settings: {
    year: 2015
  },
  enabled: true
};
