export default {
  widget: 'emissionsDeforestation',
  title: 'Emissions from biomass loss in {location}',
  categories: ['climate'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    forestTypes: true,
    landCategories: true,
    startYears: true,
    endYears: true,
    yearsRange: ['2001', '2017'],
    units: ['co2Emissions', 'biomassCarbon']
  },
  analysis: true,
  layers: ['b32a2f15-25e8-4ecc-98e0-68782ab1c0fe'],
  metaKey: 'widget_carbon_emissions_tree_cover_loss',
  dataType: 'loss',
  colors: 'emissions',
  sentences: {
    initial:
      'Between {startYear} and {endYear}, {value} of {type} was released into the atmosphere as a result of tree cover loss in {location}.',
    containsIndicator:
      'Between {startYear} and {endYear}, {value} of {type} was released into the atmosphere as a result of tree cover loss within {indicatorText} in {location}.'
  }
};
