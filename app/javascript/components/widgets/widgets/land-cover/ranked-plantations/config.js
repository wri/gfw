export default {
  widget: 'rankedPlantations',
  title: 'Location of plantations in {location}',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  metaKey: 'widget_plantations_ranked',
  // options: {
  //   types: true
  // },
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
    '{region} has the largest relative plantation area in {location} at {percentage}, most of which is in {topType}.',
  whitelists: {
    indicators: ['plantations']
  }
};
