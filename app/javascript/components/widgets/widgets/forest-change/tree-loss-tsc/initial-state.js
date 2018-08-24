export default {
  title: {
    withLocation: 'Annual tree cover loss by driver in {location}',
    global: 'Global annual tree cover loss by driver'
  },
  config: {
    admins: ['global', 'country'],
    selectors: ['thresholds', 'startYears', 'endYears'],
    layers: ['loss_by_driver'],
    yearRange: ['2001', '2015'],
    metaKey: 'tsc_drivers',
    sortOrder: {
      summary: 0,
      forestChange: 0,
      global: 0
    },
    sentences: {
      initial:
        'In {location} from {startYear} to {endYear}, {percent} of tree cover loss occurred in areas where {driver} ',
      globalInitial:
        '{location} from {startYear} to {endYear}, {percent} of tree cover loss occurred in areas where {driver} ',
      perm:
        '(permenant change) is the dominant driver of land cover/land use change.',
      temp:
        '(temporary change) is the dominant driver of land cover/land use change.'
    }
  },
  settings: {
    threshold: 30,
    startYear: 2001,
    endYear: 2015,
    layers: ['loss_by_driver']
  },
  enabled: true
};
