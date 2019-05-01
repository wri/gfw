export default {
  widget: 'traseCommodities',
  title: 'Commodities flow from {location}',
  large: true,
  categories: ['land-use'],
  types: ['country'],
  admins: ['adm0'],
  options: {
    startYears: true,
    endYears: true,
    units: ['t', '%'],
    commodities: true
  },
  dataType: 'trase',
  colors: 'extent',
  metaKey: 'trase',
  sortOrder: {
    landUse: 1
  },
  sentence:
    'From {startYear} to {endYear}, the top sourcing country for {commodity} was {source}, with a trade volume of {volume}, representing {percentage} of total {location} exports.',
  whitelists: {
    adm0: ['BRA']
  }
};
