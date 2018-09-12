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
      summary: 1,
      forestChange: 1,
      global: 1
    },
    sentences: {
      initial:
        'In {location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {permanent deforestation}.',
      globalInitial:
        '{location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {permanent deforestation}.'
    }
  },
  settings: {
    tscDriverGroup: 'all',
    endYear: 2015,
    layers: ['loss_by_driver'],
    highlighted: false
  },
  enabled: true
};
