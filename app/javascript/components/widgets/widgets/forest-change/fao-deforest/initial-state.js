export const initialState = {
  title: 'FAO deforestation',
  config: {
    size: 'small',
    categories: ['forest-change'],
    admins: ['country'],
    selectors: ['periods'],
    type: 'fao',
    metaKey: 'widget_deforestation_fao',
    sortOrder: {
      forestChange: 3
    },
    colors: 'loss',
    sentences: {
      initial: 'In {year}, the rate of deforestation in {location} was {rate}.',
      humanDeforest:
        'In {year}, the rate of deforestation in {location} was {rate}, of which {human} was due to human activity.',
      noDeforest: 'No deforestation data in {location}.'
    }
  },
  settings: {
    period: 2010,
    unit: 'ha/year'
  },
  enabled: true
};
