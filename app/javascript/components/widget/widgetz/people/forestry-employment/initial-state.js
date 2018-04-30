export default {
  title: 'Forestry Employment by Gender',
  config: {
    size: 'small',
    categories: ['people'],
    admins: ['country'],
    selectors: ['years'],
    years: [1990, 2000, 2005, 2010],
    type: 'fao',
    metaKey: 'widget_forestry_employment',
    sortOrder: {
      people: 2
    },
    colors: 'employment',
    sentences: {
      initial:
        'According to the FAO there were {value} people employed in {location} Forestry sector in {year}.',
      withFemales:
        'According to the FAO there were {value} people employed in {location} Forestry sector in {year}, of which {count} were female.'
    }
  },
  settings: {
    year: 2010
  },
  enabled: true
};
