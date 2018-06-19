export default {
  title: {
    withLocation: 'Historical emissions in {location}'
  },
  config: {
    size: 'small',
    categories: ['climate'],
    admins: ['country'],
    metaKey: 'widget_historical_emissions',
    type: 'loss',
    colors: 'emissions',
    sentences: {
      positive:
        'In {location}, the land-use change and forestry sector is a {type} of CO\u2082, emitting an average of {value} from {startYear} to {endYear}. This represents {percentage} of {location_alt} total greenhouse gas emissions over the same period.',
      negative:
        'In {location}, the land-use change and forestry sector is a {type} of CO\u2082, sequestering an average of {value} from {startYear} to {endYear}. This represents an offset of {percentage} of {location_alt} total greenhouse gas emissions over the same period.'
    }
  },
  enabled: true
};
