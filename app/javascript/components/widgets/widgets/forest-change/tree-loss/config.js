export default {
  widget: 'treeLoss',
  title: 'Tree cover loss in {location}',
  categories: ['summary', 'forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  large: true,
  analysis: true,
  options: {
    forestTypes: ['ifl', 'primary_forest', 'mangroves_2016'],
    landCategories: true,
    startYears: true,
    endYears: true,
    thresholds: true,
    extentYears: true
  },
  colors: 'loss',
  dataType: 'loss',
  metaKey: 'widget_tree_cover_loss',
  datasets: [
    // loss
    {
      dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
      layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6']
    }
  ],
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentence: {
    initial:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover, equivalent to a {percent} decrease since {extentYear}',
    withIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}, equivalent to a {percent} decrease since {extentYear}',
    noLoss:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover',
    noLossWithIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}',
    co2Emissions: 'and {emissions} of CO\u2082 emissions'
  }
};
