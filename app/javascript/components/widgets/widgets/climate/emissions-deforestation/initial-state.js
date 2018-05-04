export default {
  title: 'Emissions from biomass loss',
  config: {
    size: 'small',
    indicators: [
      'gadm28',
      'bra_biomes',
      'mining',
      'wdpa',
      'primary_forest',
      'ifl_2013',
      'landmark'
    ],
    categories: ['climate'],
    admins: ['country', 'region', 'subRegion'],
    selectors: ['indicators', 'startYears', 'endYears', 'units'],
    units: ['biomassCarbon', 'co2Emissions'],
    yearRange: ['2001', '2016'],
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
    indicator: 'gadm28',
    unit: 'biomassCarbon',
    threshold: 30,
    startYear: 2001,
    endYear: 2016
  },
  enabled: true
};
