export default {
  title: 'Location of tree cover',
  config: {
    size: 'small',
    forestTypes: ['ifl_2013', 'plantations', 'primary_forest'],
    landCategories: ['mining', 'wdpa', 'landmark'],
    units: ['ha', '%'],
    categories: ['summary', 'land-cover'],
    admins: ['global', 'country', 'region'],
    selectors: [
      'forestTypes',
      'landCategories',
      'thresholds',
      'units',
      'extentYears'
    ],
    locationCheck: true,
    type: 'extent',
    metaKey: 'widget_forest_location',
    layers: ['forest2000', 'forest2010'],
    sortOrder: {
      summary: 5,
      landCover: 2
    },
    sentences: {
      globalInitial:
        '{location}, {count} regions represent {percentage} of all tree cover. {region} has the largest tree cover at {value} compared to an average of {average}.',
      globalHasPercentage:
        '{location}, {region} had the largest relative tree cover of {value}, compared to a national average of {average}.',
      globalHasIndicator:
        'Within For {indicator} {location}, {count} regions represent {percentage} of all tree cover. {region} has the largest tree cover at {value} compared to an average of {average}.',
      initial:
        'In {location}, {count} regions represent {percentage} of all tree cover. {region} has the largest tree cover at {value} compared to an average of {average}.',
      hasIndicator:
        'For {indicator} in {location}, {count} regions represent {percentage} of all tree cover. {region} has the largest tree cover at {value} compared to an average of {average}.',
      hasPercentage:
        '{region} had the largest relative tree cover of {value}, compared to a regional average of {average}.'
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
    threshold: 30,
    extentYear: 2010,
    layers: ['forest2010'],
    unit: '%',
    pageSize: 5,
    page: 0
  },
  enabled: true
};
