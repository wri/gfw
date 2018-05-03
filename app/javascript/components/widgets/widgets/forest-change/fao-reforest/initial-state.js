export const initialState = {
  title: 'FAO reforestation',
  config: {
    size: 'small',
    categories: ['forest-change'],
    admins: ['country'],
    selectors: ['periods'],
    type: 'fao',
    metaKey: 'widget_rate_of_restoration_fao',
    sortOrder: {
      forestChange: 6
    },
    colors: 'gain',
    sentences: {
      initial: 'In {year}, the rate of deforestation in {location} was {rate}.',
      noReforest: 'No deforestation data in {location}.'
    }
  },
  settings: {
    period: 2010,
    unit: 'ha/year'
  },
  enabled: true
};
