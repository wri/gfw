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
  datasets: [
    // tree cover
    {
      dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
      layers: {
        2010: '78747ea1-34a9-4aa7-b099-bdb8948200f4',
        2000: 'c05c32fd-289c-4b20-8d73-dc2458234e04'
      }
    }
  ],
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
