export default {
  widget: 'cumulativeGlad',
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
  colors: 'fires',
  metaKey: 'widget_nydf_emissions_tracker',
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
