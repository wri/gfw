export default {
  widget: 'futureCarbonGains',
  title: {
    initial: 'Annual tree cover loss by dominant driver in {location}',
    global: 'Global annual tree cover loss by dominant driver'
  },
  categories: ['climate'],
  colors: 'climate',
  types: ['country'],
  admins: ['adm0'],
  options: {
    units: ['co2Gain', 'cGain']
  },
  metaKey: 'potential_tree_biomass_gain',
  sortOrder: {
    summary: 1,
    forestChange: 1,
    global: 1
  },
  datasets: [
    // potential carbon gains
    {
      dataset: 'b7a34457-1d8a-456e-af46-876e0b42fb96',
      layers: ['c9e48a9f-2dca-4233-9400-0b5e4e07674f']
    }
  ],
  analysis: true,
  sentences: {
    initial:
      'In {location}, potential carbon sequestration may reach {amount} of {variable} by {maxYear}.'
  },
  whitelists: {
    adm0: [
      'ARG',
      'BLZ',
      'BOL',
      'BRA',
      'COL',
      'CRI',
      'CUB',
      'ECU',
      'SLV',
      'GTM',
      'GUY',
      'HND',
      'JAM',
      'MEX',
      'NIC',
      'PAN',
      'PRY',
      'PER',
      'PRI',
      'SUR',
      'VEN'
    ]
  }
};
