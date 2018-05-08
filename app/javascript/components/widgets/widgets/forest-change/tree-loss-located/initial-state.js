export default {
  title: 'Location of tree cover loss',
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
    categories: ['summary', 'forest-change'],
    admins: ['country', 'region'],
    selectors: [
      'indicators',
      'thresholds',
      'units',
      'startYears',
      'endYears',
      'extentYears'
    ],
    locationCheck: true,
    type: 'loss',
    layers: ['loss'],
    metaKey: 'widget_tree_cover_loss_location',
    sortOrder: {
      summary: 2,
      forestChange: 2
    },
    sentences: {
      initial:
        'In {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most tree cover loss at {value} compared to an average of {average}.',
      withIndicator:
        'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most tree cover loss at {value} compared to an average of {average}.',
      initialPercent:
        'In {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most relative tree cover loss at {value} compared to an average of {average}.',
      withIndicatorPercent:
        'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most relative tree cover loss at {value} compared to an average of {average}.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30,
    extentYear: 2000,
    unit: 'ha',
    pageSize: 5,
    page: 0,
    startYear: 2001,
    endYear: 2016,
    layers: ['loss']
  },
  enabled: true
};
