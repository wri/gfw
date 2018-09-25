export default {
  widget: 'treeLoss',
  title: 'Tree cover loss in {location}',
  categories: ['summary', 'forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  large: true,
  analysis: true,
  options: {
    forestTypes: ['ifl', 'primary_forest', 'mangrove_2010_gmw'],
    landCategories: true,
    startYears: true,
    endYears: true,
    thresholds: true,
    extentYears: true
  },
  colors: 'loss',
  dataType: 'loss',
  metaKey: 'widget_tree_cover_loss',
  layers: ['loss', 'c3075c5a-5567-4b09-bc0d-96ed1673f8b6'],
  activeDataKeys: {
    type: 'date'
  },
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentence: {
    initial:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover, equivalent to a {percent} decrease since {extentYear} and {emissions} of CO\u2082 emissions.',
    withIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}, equivalent to a {percent} decrease since {extentYear} and {emissions} of CO\u2082 emissions.',
    noLoss:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover.',
    noLossWithIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}.'
  }
};
