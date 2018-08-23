export default {
  title: {
    withLocation: 'Annual tree cover loss by driver in {location}',
    global: 'Global annual tree cover loss by driver'
  },
  config: {
    admins: ['global', 'country'],
    selectors: ['thresholds', 'extentYears', 'startYears', 'endYears'],
    layers: ['loss_by_driver'],
    startYears: [
      2001,
      2002,
      2003,
      2004,
      2005,
      2006,
      2007,
      2008,
      2009,
      2010,
      2011,
      2012,
      2013,
      2014,
      2015
    ],
    endYears: [
      2001,
      2002,
      2003,
      2004,
      2005,
      2006,
      2007,
      2008,
      2009,
      2010,
      2011,
      2012,
      2013,
      2014,
      2015
    ],
    metaKey: 'tsc_drivers',
    sortOrder: {
      summary: 0,
      forestChange: 0,
      global: 0
    },
    sentences: {
      initial:
        'In {location} from {startYear} and {endYear}, {percent} of tree cover loss occurred in areas where {driver} is the dominant driver of land cover change.',
      globalInitial:
        '{location} from {startYear} and {endYear}, {percent} of tree cover loss occurred in areas where {driver} is the dominant driver of land cover change.'
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
