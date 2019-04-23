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
  layers: ['loss', 'plantations_by_type'],
  sortOrder: {
    forestChange: 2
  },
  sentence:
    'From {startYear} to {endYear}, {percentage} of tree cover loss in {location} occurred within {lossPhrase}. The total loss within natural forest was equivalent to {value} of CO<sub>2</sub> emissions.',
  whitelists: {
    indicators: ['plantations']
  }
};
