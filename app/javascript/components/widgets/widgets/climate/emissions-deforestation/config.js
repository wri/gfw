export default {
  widget: 'emissionsDeforestation',
  title: 'Emissions from biomass loss in {location}',
  categories: ['climate'],
  types: ['country', 'geostore', 'use', 'wdpa'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    startYears: true,
    endYears: true,
    thresholds: true,
    units: ['co2LossByYear', 'cLossByYear']
  },
  datasets: [
    // biomass loss
    {
      dataset: 'a9cc6ec0-5c1c-4e36-9b26-b4ee0b50587b',
      layers: ['b32a2f15-25e8-4ecc-98e0-68782ab1c0fe']
    }
  ],
  analysis: true,
  metaKey: 'widget_carbon_emissions_tree_cover_loss',
  dataType: 'loss',
  colors: 'climate',
  sentences:
    'Between {startYear} and {endYear}, a total of {value} of {type} ({annualAvg} per year) was released into the atmosphere as a result of tree cover loss in {location}.'
};
