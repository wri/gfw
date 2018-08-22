export default {
  title: {
    withLocation: 'Annual tree cover loss by driver in {location}',
    global: 'Global annual tree cover loss by driver'
  },
  config: {
    admins: ['global', 'country'],
    selectors: ['thresholds', 'extentYears', 'startYears', 'endYears'],
    layers: ['loss_by_driver'],
    sentences: {
      initial:
        "Between {startYear} and {endYear}, {location} lost {loss} of tree cover loss. This loss is equal to {percent} of the area's tree cover in {extentYear}, and equivalent to {emissions} of CO\u2082 emissions."
    }
  },
  settings: {
    threshold: 30,
    startYear: 2001,
    endYear: 2017,
    layers: ['loss_by_driver']
  },
  enabled: true
};
