export default {
  title: {
    withLocation: 'Location of deforestation Alerts in {location}'
  },
  config: {
    size: 'small',
    units: ['ha', '%'],
    categories: ['forest-change'],
    admins: ['country', 'region'],
    selectors: [
      'forestTypes',
      'landCategories',
      'thresholds',
      'units',
      'extentYears',
      'weeks'
    ],
    metaKey: 'widget_deforestation_alert_location',
    locationWhitelist: [
      'BRA',
      'COL',
      'ECU',
      'GUF',
      'GUY',
      'PER',
      'SUR',
      'BDI',
      'CMR',
      'CAF',
      'GNQ',
      'GAB',
      'RWA',
      'UGA',
      'IDN',
      'MYS',
      'PNG',
      'VEN',
      'TLS',
      'COD',
      'COG'
    ],
    locationCheck: true,
    type: 'loss',
    layers: ['umd_as_it_happens'],
    sortOrder: {
      summary: 6,
      forestChange: 10
    },
    sentences: {
      initial:
        'In the last {timeframe} in {location}, {count} GLAD alerts were detected, which affected an area of approximately {area}. The top {topRegions} accounted for {topPercent} of all GLAD alerts.',
      withInd:
        'In the last {timeframe} in {location}, {count} GLAD alerts were detected within {indicator}, which affected an area of approximately {area}. The top {topRegions} accounted for {topPercent} of all GLAD alerts.'
    }
  },
  settings: {
    threshold: 30,
    extentYear: 2010,
    unit: '%',
    weeks: 4,
    pageSize: 5,
    page: 0,
    layers: ['umd_as_it_happens']
  },
  enabled: true
};
