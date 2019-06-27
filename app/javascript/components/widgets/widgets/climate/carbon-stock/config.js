export default {
  widget: 'carbonStock',
  title: 'Carbon stock in {location}',
  categories: ['climate'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    variables: ['totalbiomass', 'biomassdensity'],
    thresholds: true
  },
  colors: 'climate',
  metaKey: '',
  sortOrder: {
    climate: 4
  },
  sentences:
    '{location} has a total carbon store of {carbonValue}, with most of the carbon stored in {carbonStored}.'
};
