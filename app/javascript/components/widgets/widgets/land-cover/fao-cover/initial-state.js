export const initialState = {
  title: 'FAO forest cover',
  config: {
    size: 'small',
    categories: ['land-cover'],
    admins: ['global', 'country'],
    type: 'fao',
    metaKey: 'widget_forest_cover_fao',
    sortOrder: {
      landCover: 5
    },
    colors: 'extent',
    sentences: {
      initial:
        'FAO data from 2015 shows that {location} contains {extent} of forest, with Primary forest occupying {primaryPercent} of the country.',
      noPrimary:
        'FAO data from 2015 shows that {location} contains {extent} of forest, which occupies {primaryPercent} of the country.'
    }
  },
  settings: {
    unit: 'ha'
  },
  enabled: true
};
