export default {
  title: 'Tree cover gain',
  config: {
    size: 'small',
    indicators: [
      'gadm28',
      'wdpa',
      'primary_forest',
      'plantations',
      'ifl_2013',
      'landmark',
      'mining'
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
        'From 2001 to 2012, {location} gained {gain} of tree cover {region}.',
      withGain:
        'From 2001 to 2012, {location} gained {gain} of tree cover {region}, equivalent to a {percentage} increase relative to {extentYear} tree cover extent.',
      withIndicator:
        'From 2001 to 2012, {location} gained {gain} of tree cover in {region}.',
      withGainAndIndicator:
        'From 2001 to 2012, {location} gained {gain} of tree cover in {region}, equivalent to a {percentage} increase relative to {extentYear} tree cover extent.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30,
    unit: 'ha',
    extentYear: 2010,
    layers: ['forestgain']
  },
  enabled: true
};
