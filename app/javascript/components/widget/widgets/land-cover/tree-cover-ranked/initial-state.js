export default {
  title: 'Tree cover extent',
  config: {
    size: 'small',
    indicators: ['gadm28', 'wdpa', 'kba', 'aze', 'tcl'],
    units: ['ha', '%'],
    categories: ['land-cover'],
    admins: ['country'],
    selectors: ['indicators', 'thresholds', 'extentYears', 'units'],
    type: 'extent',
    metaKey: 'widget_forest_cover_ranking',
    layers: ['forest2000', 'forest2010'],
    sortOrder: {
      summary: 1,
      landCover: 1
    },
    sentences: {
      initial:
        'As of {extentYear}, {location} represented {percentage} of global tree cover.',
      withInd:
        'As of {extentYear}, {location} represented {percentage} of global tree cover in {indicator}.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30,
    unit: 'ha',
    extentYear: 2000,
    layers: ['forest2010']
  },
  enabled: true
};
