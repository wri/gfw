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
        'In {location} from {startYear} to {endYear}, {loss} of tree cover loss occurred in areas where ',
      globalInitial:
        '{location} from {startYear} to {endYear}, {loss} of tree cover loss occurred in areas where ',
      permInitial:
        'In {location} from {startYear} to {endYear}, {permLoss} of tree cover loss occurred due to {group} land cover/land use change, equivalent to {permPercent} of all tree cover loss.',
      permGlobal:
        '{location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred due to {group} land cover/land use change, equivalent to {permPercent} of all tree cover loss.',
      perm:
        '{driver} is the dominant driver of permenant land cover/land use change, equivalent to {percent} of all tree cover loss.',
      temp:
        '{driver} is the dominant driver of temporary land cover/land use change, equivalent to {percent} of all tree cover loss.',
      noLoss: 'From {startYear} to {endYear}, there was {loss} of tree cover.'
    }
  },
  settings: {
    tscDriverGroup: 'all',
    endYear: 2015,
    layers: ['loss_by_driver']
  },
  enabled: true
};
