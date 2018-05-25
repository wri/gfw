export default {
  title: 'Location of tree cover',
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
    categories: ['summary', 'land-cover'],
    admins: ['country', 'region'],
    selectors: ['indicators', 'thresholds', 'units', 'extentYears'],
    locationCheck: true,
    type: 'extent',
    metaKey: 'widget_forest_location',
    layers: ['forest2000', 'forest2010'],
    sortOrder: {
      summary: 5,
      landCover: 2
    },
    sentences: {
      initial:
        'In {location}, {count} regions represent {percentage} of all tree cover. {region} has the largest tree cover at {extent} compared to an average of {averageExtent}.',
      hasIndicator:
        'For {indicator} in {location}, {count} regions represent {percentage} of all tree cover. {region} has the largest tree cover at {extent} compared to an average of {averageExtent}.',
      largePercentile:
        'In {location}, the top {count} regions represent {percentage} of all tree cover. {region} has the largest tree cover at {extent} compared to an average of {averageExtent}.',
      largePercentileWithIndicator:
        'For {indicator} in {location}, the top {count} regions represent {percentage} of all tree cover. {region} has the largest tree cover at {extent} compared to an average of {averageExtent}.',
      hasPercentage:
        '{region} had the largest relative tree cover of {relPercentage}, compared to a regional average of {averagePerc}.',
      noCover: 'No tree cover was identified in {location}.'
    },
    data: [
      {
        data: 'extent',
        threshold: 'current',
        indicator: 'gadm28'
      },
      {
        data: 'extent',
        threshold: 'current',
        indicator: 'current'
      }
    ]
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30,
    extentYear: 2010,
    layers: ['forest2010'],
    unit: 'ha',
    pageSize: 5,
    page: 0
  },
  enabled: true
};
