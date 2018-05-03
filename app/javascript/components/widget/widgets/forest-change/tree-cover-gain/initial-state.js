export default {
  title: 'Tree cover gain',
  config: {
    size: 'small',
    indicators: [
      'gadm28',
      'wdpa',
      'plantations',
      'landmark',
      'mining',
      'kba',
      'aze',
      'tcl'
    ],
    units: ['ha', '%'],
    categories: ['summary', 'forest-change'],
    admins: ['country', 'region', 'subRegion'],
    selectors: ['indicators', 'thresholds', 'extentYears', 'units'],
    type: 'gain',
    metaKey: 'widget_tree_cover_gain',
    layers: ['forestgain'],
    sortOrder: {
      summary: 6,
      'forest-change': 4
    },
    sentences: {
      initial:
        'From 2001 to 2012, {location} gained {gain} of tree cover {indicator}, equivalent to a {percent} increase since {extentYear} and {globalPercent} of global tree cover gain.',
      withIndicator:
        'From 2001 to 2012, {location} gained {gain} of tree cover in {indicator}, equivalent to a {percent} increase since {extentYear} and {globalPercentage} of global tree cover gain within {indicator_alt}.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 50,
    unit: 'ha',
    extentYear: 2010,
    layers: ['forestgain']
  },
  enabled: true
};
