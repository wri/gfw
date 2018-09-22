export default {
  // key for url and state
  widget: 'treeCover',
  // title for header
  title: {
    default: 'Tree cover in {location}',
    global: 'Global tree cover',
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
  large: true,
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
  // layers to show on map
  layers: ['forest2000', 'forest2010'],
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
