export default {
  widget: 'globalLandCover',
  title: 'Land cover for {location}',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  options: {
    years: [2015]
  },
  analysis: true,
  layers: ['c09767f5-0ff0-419b-a21b-1b0b06f4745f'],
  colors: 'plantations',
  metaKey: 'widget_land_cover_esa',
  sortOrder: {
    landCover: 100
  },
  sentences:
    'The land use of {location} in {year} is mostly {category}, covering an area of {extent}.'
};
