export default {
  widget: 'firesAlerts',
  title: 'Fire Alerts in {location}',
  large: true,
  categories: ['climate'],
  options: {
    years: true
  },
  analysis: true,
  types: ['country'],
  admins: ['adm0'],
  layers: [],
  colors: 'fires',
  metaKey: 'source-insights-glad-alerts',
  sortOrder: {
    summary: 100,
    forestChange: 100
  },
  sentence:
    'As of {date}, the total {variable} for {location} in {year} sums a total value of {value}.',
  whitelists: {
    adm0: [
      'BRA',
      'BRN',
      'BDI',
      'CMR',
      'CAF',
      'COD',
      'GNQ',
      'GAB',
      'IDN',
      'MYS',
      'PNG',
      'PER',
      'COG',
      'RWA',
      'SGP',
      'TLS'
    ]
  }
};
