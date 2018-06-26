export default {
  title: {
    global: 'Global Intact forest',
    withLocation: 'Intact forest in {location}'
  },
  config: {
    size: 'small',
    categories: ['land-cover'],
    admins: ['global', 'country', 'region', 'subRegion'],
    selectors: ['landCategories', 'thresholds'],
    type: 'extent',
    metaKey: 'widget_ifl',
    layers: ['forest2000', 'forest2010', 'ifl_2013_deg'],
    sortOrder: {
      landCover: 3
    },
    sentences: {
      initial:
        'As of 2013, {percentage} of {location} tree cover was <b>intact forest</b>.',
      withIndicator:
        'As of 2013, {percentage} of {location} tree cover in {indicator} was <b>intact forest</b>.',
      noIntact:
        'As of 2013, <b>none</b> of {location} tree cover was <b>intact forest</b>.',
      noIntactwithIndicator:
        'As of 2013, <b>none</b> of {location} tree cover in {indicator} was <b>intact forest</b>.'
    }
  },
  settings: {
    forestType: 'ifl',
    threshold: 30,
    extentYear: 2010,
    layers: ['forest2010', 'ifl_2013_deg']
  },
  enabled: true
};
