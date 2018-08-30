export default {
  title: {
    global: 'Global tree cover',
    withLocation: 'Tree cover in {location}',
    withPlantations: 'Forest cover in {location}'
  },
  config: {
    size: 'small',
    categories: ['summary', 'land-cover'],
    admins: ['global', 'country', 'region', 'subRegion'],
    selectors: ['landCategories', 'thresholds', 'extentYears'],
    type: 'extent',
    metaKey: 'widget_tree_cover',
    layers: ['forest2000', 'forest2010'],
    sortOrder: {
      summary: 4,
      landCover: 1
    },
    sentences: {
      globalInitial:
        'As of {year}, {percentage} of {location} land cover was tree cover.',
      globalWithIndicator:
        'As of {year}, {percentage} of {location} tree cover was in {indicator}.',
      initial: 'As of {year}, {percentage} of {location}',
      hasPlantations: ' was natural forest cover.',
      noPlantations: ' was tree cover.',
      hasPlantationsInd: "<b>'s</b> natural forest was in {indicator}.",
      noPlantationsInd: "<b>'s</b> tree was in {indicator}."
    }
  },
  settings: {
    threshold: 30,
    extentYear: 2010,
    layers: ['forest2010']
  },
  enabled: true
};
