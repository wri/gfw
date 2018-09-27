export default {
  widget: 'faoDeforest',
  title: {
    global: 'Global FAO deforestation',
    initial: 'FAO deforestation in {location}'
  },
  categories: ['forest-change'],
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  options: {
    periods: true
  },
  dataType: 'fao',
  colors: 'loss',
  metaKey: 'widget_deforestation_fao',
  sortOrder: {
    forestChange: 5
  },
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
};
