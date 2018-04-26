export const initialState = {
  title: 'Tree cover extent',
  config: {
    size: 'small',
    indicators: [
      'gadm28',
      'ifl_2013',
      'mining',
      'wdpa',
      'plantations',
      'landmark',
      'primary_forest',
      'ifl_2013',
      'ifl_2013__wdpa',
      'ifl_2013__mining',
      'ifl_2013__landmark',
      'primary_forest',
      'primary_forest__mining',
      'primary_forest__wdpa',
      'primary_forest__landmark',
      'plantations__mining',
      'plantations__wdpa',
      'plantations__landmark'
    ],
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
        'As of {extentYear}, {location} had {extent} of tree cover region-wide.',
      withInd:
        'As of {extentYear}, {location} had {extent} of tree cover in {region}.',
      withPerc:
        'As of {extentYear}, {location} had {extent} of tree cover region-wide, equivalent to {percentage} of the country.',
      withPercAndInd:
        'As of {extentYear}, {location} had {extent} of tree cover in {region}, equivalent to {percentage} of the country.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30,
    unit: 'ha',
    extentYear: 2010,
    layers: ['forest2010']
  },
  enabled: true
};
