export default {
  title: {
    withLocation: 'Emissions from biomass loss in {location}'
  },
  config: {
    size: 'small',
    categories: ['climate'],
    admins: ['country', 'region', 'subRegion'],
    selectors: [
      'forestTypes',
      'landCategories',
      'startYears',
      'endYears',
      'units'
    ],
    units: ['co2Emissions', 'biomassCarbon'],
    yearRange: ['2001', '2017'],
    metaKey: 'widget_carbon_emissions_tree_cover_loss',
    type: 'loss',
    colors: 'emissions',
    sentences: {
      initial:
        'Between {startYear} and {endYear}, {value} of {type} was released into the atmosphere as a result of tree cover loss in {location}.',
      containsIndicator:
        'Between {startYear} and {endYear}, {value} of {type} was released into the atmosphere as a result of tree cover loss within {indicatorText} in {location}.'
    }
  },
  settings: {
    unit: 'co2Emissions',
    threshold: 30,
    startYear: 2001,
    endYear: 2017
  },
  enabled: true
};
