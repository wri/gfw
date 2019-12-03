export default {
  widget: 'gladRanked',
  title: 'Location of deforestation Alerts in {location}',
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  options: {
    forestTypes: ['plantations', 'ifl_2016', 'primary_forest'],
    landCategories: ['mining', 'wdpa', 'landmark'],
    thresholds: true,
    units: ['%', 'ha'],
    extentYears: true,
    weeks: true
  },
  metaKey: 'widget_deforestation_alert_location',
  colors: 'loss',
  datasets: [
    // GLAD
    {
      dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
      layers: ['dd5df87f-39c2-4aeb-a462-3ef969b20b66']
    }
  ],
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
