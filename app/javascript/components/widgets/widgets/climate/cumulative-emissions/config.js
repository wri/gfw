export default {
  widget: 'firesAlerts',
  title: 'New York Declaration Forest disturbance tracker',
  large: true,
  categories: ['climate'],
  options: {
    years: true,
    variables: ['cumulative_emissions', 'cumulative_deforestation']
  },
  analysis: true,
  types: ['country'],
  admins: ['adm0'],
  layers: ['umd_as_it_happens', 'dd5df87f-39c2-4aeb-a462-3ef969b20b66'],
  colors: 'fires',
  metaKey: 'source-insights-glad-alerts',
  sortOrder: {
    summary: 100,
    forestChange: 100
  },
  sentences: {
    cumulative_deforestation: `By week {weeknum} of {year}, there were {alerts}
confirmed alerts and {deforestation} of tree cover loss, comprising {budget} of
the annual budget. The values are shown in relation to deforestation
across previous years, indicated by the grey shading.`,
    cumulative_emissions: `By week {weeknum} of {year}, there were {alerts}
confirmed alerts and {emissions} emissions, comprising {budget} of
the annual budget. The values are shown in relation to emissions
across previous years, indicated by the grey shading.`
  },
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
