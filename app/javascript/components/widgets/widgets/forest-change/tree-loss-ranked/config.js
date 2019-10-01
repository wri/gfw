export default {
  widget: 'treeLossRanked',
  title: {
    default: 'Tree cover loss in {location} compared to other areas',
    global: 'Countries with the highest tree cover loss'
  },
  categories: ['forest-change'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  options: {
    forestTypes: ['ifl', 'primary_forest'],
    landCategories: true,
    units: ['ha', '%'],
    thresholds: true,
    extentYears: true,
    startYears: true,
    endYears: true
  },
  colors: 'loss',
  dataType: 'loss',
  metaKey: 'widget_tree_cover_loss_ranking',
  datasets: [
    // loss
    {
      dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
      layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6']
    }
  ],
  sortOrder: {
    summary: 5,
    forestChange: 4
  },
  sentence: {
    globalInitial:
      'From {startYear} to {endYear}, {topLocationLabel} had the highest relative tree cover loss in the world, eqivalent to a loss of {topLocationLoss}, which represents {topLocationPerc} of the tree cover in the year {extentYear}.',
    globalWithIndicator:
      'From {startYear} to {endYear}, {topLocationLabel} within {indicator} had the highest relative tree cover loss in the world, eqivalent to a loss of {topLocationLoss}, which represents {topLocationPerc} of the tree cover in the year {extentYear}.',
    initial:
      'From {startYear} to {endYear}, {location} lost {loss} of relative tree cover, equivalent to a {localPercent} decrease since {extentYear} and {globalPercent} of the global total.',
    withIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree relative cover in {indicator}, equivalent to a {localPercent} decrease since {extentYear} and {globalPercent} of the global total.',
    noLoss: 'There was no relative tree cover loss identified in {location}.'
  }
};
