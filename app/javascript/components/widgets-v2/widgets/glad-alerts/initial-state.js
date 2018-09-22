export default {
  config: {
    // meta
    widget: 'gladAlerts',
    title: {
      withLocation: 'Deforestation Alerts in {location}'
    },
    metaKey: 'widget_deforestation_graph',
    large: true,
    // filters
    categories: ['summary', 'forest-change'],
    admins: ['country', 'region', 'subRegion'],
    type: 'loss',
    sortOrder: {
      summary: 6,
      forestChange: 9
    },
    options: {
      weeks: [13, 26, 52]
    },
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
    sentences: {
      initial:
        'There were {count} GLAD alerts reported in the week of the {date}. This was {status} compared to the same week in previous years.'
    }
  },
  settings: {
    period: 'week',
    weeks: 13,
    layers: ['umd_as_it_happens']
  }
};
