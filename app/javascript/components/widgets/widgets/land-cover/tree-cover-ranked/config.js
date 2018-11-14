export default {
  widget: 'treeCoverRanked',
  title: 'Forest in {location} compared to other areas',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0'],
  colors: 'extent',
  dataType: 'extent',
  metaKey: 'widget_forest_cover_ranking',
  options: {
    units: ['ha', '%'],
    forestTypes: ['ifl'],
    landCategories: true,
    thresholds: true,
    extentYears: true
  },
  layers: ['forest2000', 'forest2010'],
  sortOrder: {
    summary: 1,
    landCover: 1
  },
  sentences: {
    initial:
      'As of {extentYear}, {location} had {extent} of tree cover, equivalent to {landPercentage} of its land area and {globalPercentage} of the global total.',
    landCatOnly:
      'As of {extentYear}, {location} had {extent} of tree cover in {indicator}, equivalent to {landPercentage} of its land area and {globalPercentage} of the global total.',
    withInd:
      'As of {extentYear}, {location} had {extent} of {indicator}, equivalent to {landPercentage} of its land area and {globalPercentage} of the global total.'
  }
};
