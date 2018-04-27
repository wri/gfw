export const initialState = {
  title: 'Deforestation Alerts in Biodiversity Areas',
  config: {
    size: 'small',
    indicators: ['kba', 'aze', 'wdpa'],
    units: ['ha', '%'],
    categories: ['conservation'],
    admins: ['country', 'region'],
    selectors: ['indicators', 'thresholds', 'units', 'extentYears', 'weeks'],
    metaKey: 'widget_deforestation_alert_location_biodiversity',
    customLocationWhitelist: [
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
      forestChange: 4
    },
    sentences: {
      initial:
        'In the last {timeframe}, {count} GLAD alerts were detected in {indicator} in {location}, which affected an area of approximately {area}.'
    }
  },
  settings: {
    indicator: 'kba',
    threshold: 30,
    extentYear: 2000,
    unit: 'ha',
    weeks: 4,
    pageSize: 5,
    page: 0,
    layers: ['umd_as_it_happens']
  },
  enabled: true
};
