export default {
  title: {
    withLocation: 'Annual tree cover loss by dominant driver in {location}',
    global: 'Global annual tree cover loss by dominant driver'
  },
  config: {
    admins: ['global', 'country'],
    selectors: ['tscDriverGroups', 'thresholds', 'startYears', 'endYears'],
    layers: ['loss_by_driver'],
    yearRange: [2001, 2015],
    metaKey: 'widget_tsc_drivers',
    sortOrder: {
      summary: 0,
      forestChange: 0,
      global: 0
    },
    sentences: {
      initial:
        'In {location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in <b>permenant</b> deforestation.',
      globalInitial:
        '{location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in <b>permenant</b> deforestation.'
    }
  },
  settings: {
    tscDriverGroup: 'all',
    endYear: 2015,
    layers: ['loss_by_driver']
  },
  enabled: true
};
