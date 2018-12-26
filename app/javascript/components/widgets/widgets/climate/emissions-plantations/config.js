export default {
  widget: 'emissions-plantations',
  title: {
    global: 'Emissions loss in plantations vs. natural forest',
    initial: 'Emissions loss in {location}'
  },
  categories: ['climate'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  options: {
    startYears: true,
    endYears: true
  },
  colors: 'extent',
  metaKey: '',
  layers: [],
  sortOrder: {},
  sentences: {
    initial:
      'From {startYear} to {endYear}, {percentage} of tree cover loss in {location} occurred within plantations. The total loss within natural forest was equivalent to {emissions} of CO2 emissions.'
  }
};
