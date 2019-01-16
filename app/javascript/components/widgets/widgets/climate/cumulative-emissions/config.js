export default {
  widget: 'firesAlerts',
  title: 'Fire Alerts in {location}',
  large: true,
  categories: ['climate'],
  options: {
    weeks: [13, 26, 52],
    datasets: true
  },
  analysis: true,
  types: ['country'],
  admins: ['adm0'],
  layers: [],
  colors: 'fires',
  metaKey: '',
  sortOrder: {
    summary: 100,
    forestChange: 100
  },
  sentence:
    'There were {count} {dataset} fire alerts reported in the week of the {date}. This was {status} compared to the same week in previous years.',
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
