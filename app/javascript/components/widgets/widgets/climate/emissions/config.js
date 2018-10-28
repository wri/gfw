export default {
  widget: 'emissions',
  title: 'Historical emissions in {location}',
  categories: ['climate'],
  types: ['country'],
  admins: ['adm0'],
  metaKey: 'widget_historical_emissions',
  dataType: 'loss',
  colors: 'emissions',
  hideSettings: true,
  sentences: {
    positive:
      'In {location}, the land-use change and forestry sector is a {type} of CO\u2082, emitting an average of {value} from {startYear} to {endYear}. This represents {percentage} of {location_alt} total greenhouse gas emissions over the same period.',
    negative:
      'In {location}, the land-use change and forestry sector is a {type} of CO\u2082, sequestering an average of {value} from {startYear} to {endYear}. This represents an offset of {percentage} of {location_alt} total greenhouse gas emissions over the same period.'
  }
};
