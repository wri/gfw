export const initialState = {
  title: {
    global: 'Global FAO deforestation',
    withLocation: 'FAO deforestation in {location}'
  },
  config: {
    size: 'small',
    categories: ['forest-change'],
    admins: ['global', 'country'],
    selectors: ['periods'],
    type: 'fao',
    metaKey: 'widget_deforestation_fao',
    sortOrder: {
      forestChange: 5
    },
    colors: 'loss',
    sentences: {
      globalInitial:
        'According to the FAO, the {location} rate of deforestation in {year} was {rate}.',
      globalHuman:
        'According to the FAO, the {location} rate of deforestation in {year} was {rate}, of which {human} was due to human activity.',
      initial:
        'According to the FAO, the rate of deforestation in {location} was {rate} in {year}.',
      humanDeforest:
        'According to the FAO, the rate of deforestation in {location} was {rate} in {year}, of which {human} was due to human activity.',
      noDeforest: 'No deforestation data in {location}.'
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
