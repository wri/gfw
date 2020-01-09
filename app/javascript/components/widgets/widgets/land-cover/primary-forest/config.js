export default {
  widget: 'primaryForest',
  title: 'Primary forest in {location}',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    landCategories: true,
    thresholds: true
  },
  colors: 'extent',
  metaKey: 'widget_primary_forest',
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
    landCover: 4
  },
  sentences: {
    initial:
      'As of 2001, {percentage} of {location} total tree cover was <b>primary forest</b>.',
    withIndicator:
      'As of 2001, {percentage} of {location} total tree cover in {indicator} was <b>primary forest</b>.'
  },
  whitelists: {
    adm0: ['IDN', 'COD']
  }
};
