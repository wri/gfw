export default {
  widget: 'forestryEmployment',
  title: 'Forestry Employment in {location}',
  categories: ['land-use'],
  types: ['country'],
  admins: ['adm0'],
  options: {
    years: [1990, 2000, 2005, 2010]
  },
  dataType: 'fao',
  metaKey: 'widget_forestry_employment',
  sortOrder: {
    landUse: 2
  },
  colors: 'employment',
  sentences: {
    initial:
      'According to the FAO there were {value} people employed in {location} Forestry sector in {year}.',
    withFemales:
      'According to the FAO there were {value} people employed in {location} Forestry sector in {year}, of which {percent} were female.'
  }
};
