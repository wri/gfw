export default {
  title: {
    withLocation: 'Forest in {location} compared to other areas'
  },
  config: {
    size: 'small',
    forestTypes: ['ifl_2013'],
    landCategories: ['wdpa', 'kba', 'aze', 'tcl'],
    units: ['ha', '%'],
    categories: ['land-cover'],
    admins: ['country'],
    selectors: [
      'forestTypes',
      'landCategories',
      'thresholds',
      'extentYears',
      'units'
    ],
    type: 'extent',
    metaKey: 'widget_forest_cover_ranking',
    layers: ['forest2000', 'forest2010'],
    sortOrder: {
      summary: 1,
      landCover: 1
    },
    sentences: {
      initial:
        'As of {extentYear}, {location} had {extent} of tree cover, equivalent to {landPercentage} of its land area and {globalPercentage} of global total.',
      withInd:
        'As of {extentYear}, {location} had {extent} of tree cover in {indicator}, equivalent to {landPercentage} of its land area and {globalPercentage} of global total.'
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
