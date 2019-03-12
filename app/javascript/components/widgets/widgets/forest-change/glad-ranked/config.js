export default {
  widget: 'gladRanked',
  title: 'Location of deforestation Alerts in {location}',
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  options: {
    forestTypes: true,
    landCategories: ['mining', 'wdpa', 'landmark'],
    thresholds: true,
    units: ['%', 'ha'],
    extentYears: true,
    weeks: true
  },
  metaKey: 'widget_deforestation_alert_location',
  colors: 'loss',
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
  },
  whitelists: {
    adm0: [
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
    ]
  }
};
