export const initialState = {
  title: 'FAO reforestation',
  config: {
    size: 'small',
    categories: ['forest-change'],
    admins: ['global', 'country'],
    selectors: ['periods'],
    type: 'fao',
    metaKey: 'widget_rate_of_restoration_fao',
    sortOrder: {
      forestChange: 4
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
    unit: 'ha/year'
  },
  enabled: true
};
