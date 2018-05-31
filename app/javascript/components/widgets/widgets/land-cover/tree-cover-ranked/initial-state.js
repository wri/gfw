export default {
  title: {
    withLocation: 'Tree cover extent in {location}'
  },
  config: {
    size: 'small',
    landCategories: ['wdpa', 'kba', 'aze', 'tcl'],
    units: ['ha', '%'],
    categories: ['land-cover'],
    admins: ['country'],
    selectors: ['landCategories', 'thresholds', 'extentYears', 'units'],
    type: 'extent',
    metaKey: 'widget_forest_cover_ranking',
    layers: ['forest2000', 'forest2010'],
    sortOrder: {
      summary: 1,
      landCover: 1
    },
    sentences: {
      initial:
        "As of {extentYear}, {location} had {extent} of tree cover, equivalent to {landPercentage} of it's land area and {globalPercentage} of global tree cover.",
      withInd:
        "As of {extentYear}, {location} had {extent} of tree cover, equivalent to {landPercentage} of it's land area and {globalPercentage} of global tree cover in {indicator}."
    }
  },
  settings: {
    threshold: 30,
    unit: '%',
    extentYear: 2010,
    layers: ['forest2010']
  },
  enabled: true
};
