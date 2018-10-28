export default {
  widget: 'faoReforest',
  title: {
    global: 'Global FAO reforestation',
    initial: 'FAO reforestation in {location}'
  },
  categories: ['forest-change'],
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  options: {
    periods: true
  },
  dataType: 'fao',
  metaKey: 'widget_rate_of_restoration_fao',
  sortOrder: {
    forestChange: 8
  },
  colors: 'gain',
  sentences: {
    globalInitial:
      'According to the FAO, the {location} rate of reforestation in {year} was {rate}.',
    initial:
      'According to the FAO, the rate of reforestation in {location} was {rate} in {year}.',
    noReforest: 'No reforestation data in {location}.'
  }
};
