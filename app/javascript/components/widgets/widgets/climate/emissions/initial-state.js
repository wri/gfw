export default {
  title: 'Historical emissions',
  config: {
    size: 'small',
    categories: ['climate'],
    admins: ['country'],
    metaKey: 'widget_historical_emissions',
    type: 'loss',
    colors: 'emissions',
    sentences: {
      initial:
        'In {location}, land-use change and forestry combined with agriculture contributed {value} of emissions emissions from {startYear}-{endYear}, {percentage} of {location_alt} total over this period.'
    }
  },
  enabled: true
};
