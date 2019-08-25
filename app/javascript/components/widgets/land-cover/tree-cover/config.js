export default {
  // key for url and state
  widget: 'treeCover',
  // title for header
  title: {
    default: 'Tree cover in {location}',
    global: 'Global forest cover',
    withPlantations: 'Forest cover in {location}'
  },
  // sentences for header
  sentence: {
    globalInitial:
      'As of {year}, {percentage} of {location} land cover was tree cover.',
    globalWithIndicator:
      'As of {year}, {percentage} of {location} tree cover was in {indicator}.',
    initial: 'As of {year}, {percentage} of {location}',
    hasPlantations: ' was natural forest cover.',
    noPlantations: ' was tree cover.',
    hasPlantationsInd: "<b>'s</b> natural forest was in {indicator}.",
    noPlantationsInd: "<b>'s</b> tree cover was in {indicator}."
  },
  // meta key for info button
  metaKey: 'widget_tree_cover',
  // full width or not
  large: false,
  // internal category for colors and filters
  colors: 'extent',
  // data source for filtering
  source: 'gadm',
  // data source for filtering
  dataType: 'extent',
  // categories to show widget on
  categories: ['summary', 'land-cover'],
  // types widget is available for
  types: ['global', 'country'],
  // levels of that type you can see the widget
  admins: ['global', 'adm0', 'adm1', 'adm2'],
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
  // position
  sortOrder: {
    summary: 4,
    landCover: 1
  },
  // whitelists for options
  options: {
    landCategories: true,
    thresholds: true,
    extentYears: true
  }
};
