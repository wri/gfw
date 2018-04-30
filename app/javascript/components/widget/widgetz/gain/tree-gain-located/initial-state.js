export const initialState = {
  title: 'Where did tree cover gain occur',
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
    categories: ['forest-change'],
    admins: ['country', 'region'],
    selectors: ['indicators', 'thresholds', 'units', 'extentYears'],
    locationCheck: true,
    type: 'gain',
    layers: ['forestgain'],
    metaKey: 'widget_tree_cover_gain_location',
    sortOrder: {
      'forest-change': 100
    },
    sentences: {
      initial:
        'In {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain. {region} had the largest tree cover gain at {value} compared to an average of {average}.',
      withIndicator:
        'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain. {region} had the largest tree cover gain at {value} compared to an average of {average}.',
      initialPercent:
        'In {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain. {region} had the largest relative tree cover gain at {value} compared to an average of {average}.',
      withIndicatorPercent:
        'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain. {region} had the largest relative tree cover gain at {value} compared to an average of {average}.'
    }
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30,
    unit: 'ha',
    extentYear: 2000,
    pageSize: 5,
    page: 0,
    layers: ['forestgain']
  },
  enabled: true
};
