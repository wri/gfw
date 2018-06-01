export const initialState = {
  title: {
    global: 'Global FAO reforestation',
    withLocation: 'FAO reforestation in {location}'
  },
  config: {
    size: 'small',
    categories: ['forest-change'],
    admins: ['global', 'country'],
    selectors: ['periods'],
    type: 'fao',
    metaKey: 'widget_rate_of_restoration_fao',
    sortOrder: {
      forestChange: 8
    },
    colors: 'gain',
    sentences: {
      globalInitial:
        'According to the FAO, the {location} rate of reforestation in {year} was {rate}.',
      initial:
        'According to the FAO, the rate of reforestation in {location} was {rate} in {year}',
      noReforest: 'No reforestation data in {location}.'
    }
  },
  settings: {
    period: 2010,
    unit: 'ha/year',
    pageSize: 5,
    page: 0
  },
  enabled: true
};
