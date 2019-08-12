export default {
  widget: 'national-land-cover-database',
  title: 'Land cover change in {location}',
  large: true,
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  metaKey: 'widget_plantations_ranked',
  colors: 'plantations',
  dataTypes: 'plantations',
  layers: ['plantations_by_type', 'plantations_by_species'],
  datasets: [
    {
      // global plantations
      dataset: 'bb1dced4-3ae8-4908-9f36-6514ae69713f',
      layers: ['b8fb6cc8-6893-4ae0-8499-1ca9f1ababf4']
    }
  ],
  sortOrder: {
    landCover: 101
  },
  sentence:
    'From {fromYear} to {toYear}, the highest land cover change was found in areas converted from {firstCategory} to {secondCategory}, equivalent to {amount}, which represents {percentage} of all land cover.',
  whitelists: {
    indicators: ['plantations']
  }
};
