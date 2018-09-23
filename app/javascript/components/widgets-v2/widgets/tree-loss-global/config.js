export default {
  widget: 'treeLossGlobal',
  title: 'Annual Global Tree cover loss',
  sentence: {
    initial:
      'From {startYear} and {endYear}, there was a total of {loss} of tree cover loss {location}, equivalent to a {percent} decrease since {extentYear} and {emissions} of CO\u2082 emissions.',
    withInd:
      'From {startYear} and {endYear}, there was a total of {loss} of tree cover loss {location} within {indicator}, equivalent to a {percent} decrease since {extentYear} and {emissions} of CO\u2082 emissions.'
  },
  types: ['global'],
  admins: ['global'],
  options: {
    forestTypes: ['ifl'],
    landCategories: ['wdpa'],
    extentYears: true,
    thresholds: true,
    startYears: true,
    endYears: true
  }
};
