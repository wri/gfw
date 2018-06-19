export default {
  title: {
    withLocation: 'Deforestation Alerts in {location}'
  },
  config: {
    size: 'large',
    categories: ['summary', 'forest-change'],
    weeks: [13, 26, 52],
    admins: ['country', 'region', 'subRegion'],
    type: 'loss',
    selectors: ['weeks'],
    metaKey: 'widget_deforestation_graph',
    interactive: true,
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
    layers: ['umd_as_it_happens'],
    sortOrder: {
      summary: 6,
      forestChange: 9
    },
    sentences: {
      initial:
        'There were {count} GLAD alerts reported in the week of the {date}. This was {status} compared to the same week in previous years.'
    }
  },
  settings: {
    period: 'week',
    weeks: 13,
    layers: ['umd_as_it_happens'],
    layerStartDate: null,
    layerEndDate: null
  },
  enabled: true
};
