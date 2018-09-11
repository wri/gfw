export default {
  title: {
    withLocation: 'Forestry Employment in {location}'
  },
  config: {
    size: 'small',
    categories: ['land-use'],
    admins: ['country'],
    selectors: ['years'],
    years: [1990, 2000, 2005, 2010],
    type: 'fao',
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
  },
  settings: {
    year: 2010,
    unit: ''
  },
  enabled: true
};
