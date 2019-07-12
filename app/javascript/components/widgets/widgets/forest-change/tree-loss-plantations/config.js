export default {
  widget: 'treeLossPlantations',
  title: 'Forest loss in natural forest in {location}',
  large: true,
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    startYears: true,
    endYears: true,
    thresholds: true,
    yearsRange: ['2013', '2018']
  },
  colors: 'loss',
  metaKey: 'widget_plantations_tree_cover_loss',
  datasets: [
    {
      // global plantations
      dataset: 'bb1dced4-3ae8-4908-9f36-6514ae69713f',
      layers: ['b8fb6cc8-6893-4ae0-8499-1ca9f1ababf4']
    },
    // loss
    {
      dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
      layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6']
    }
  ],
  sortOrder: {
    forestChange: 2
  },
  sentence:
    'From {startYear} to {endYear}, {percentage} of tree cover loss in {location} occurred within {lossPhrase}. The total loss within natural forest was equivalent to {value} of CO<sub>2</sub> emissions.',
  whitelists: {
    indicators: ['plantations']
  }
};
