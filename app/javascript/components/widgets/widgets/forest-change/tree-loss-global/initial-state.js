export default {
  title: {
    global: 'Annual Global Tree cover loss'
  },
  config: {
    admins: ['global'],
    forestTypes: ['ifl'],
    landCategories: ['wdpa'],
    sentences: {
      initial:
        'From {startYear} and {endYear}, there was a total of {loss} of tree cover loss {location}, equivalent to a {percent} decrease since {extentYear} and {emissions} of CO\u2082 emissions.',
      withInd:
        'From {startYear} and {endYear}, there was a total of {loss} of tree cover loss {location} within {indicator}, equivalent to a {percent} decrease since {extentYear} and {emissions} of CO\u2082 emissions.'
    }
  },
  enabled: true
};
