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
    admins: ['global', 'country', 'region', 'subRegion'],
    selectors: ['indicators', 'thresholds', 'extentYears', 'units'],
    type: 'gain',
    metaKey: 'widget_tree_cover_gain',
    layers: ['forestgain'],
    sortOrder: {
      summary: 3,
      forestChange: 6
    },
    sentences: {
      globalInitial:
        'From 2001 to 2012, {gain} of tree cover was gained {location}, equivalent to a {percent} increase since {extentYear}.',
      globalWithIndicator:
        'From 2001 to 2012, {gain} of tree cover was gained within {indicator} {location}, equivalent to a {percent} increase since {extentYear}.',
      initial:
        'From 2001 to 2012, {location} gained {gain} of tree cover {indicator}, equivalent to a {percent} increase since {extentYear} and {globalPercent} of global tree cover gain.',
      withIndicator:
        'From 2001 to 2012, {location} gained {gain} of tree cover in {indicator}, equivalent to a {percent} increase since {extentYear} and {globalPercent} of global tree cover gain within {indicator_alt}.'
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
