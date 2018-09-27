export default {
  widget: 'faoCover',
  title: {
    initial: 'FAO forest cover in {location}',
    global: 'Global FAO forest cover'
  },
  categories: ['land-cover'],
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  colors: 'extent',
  dataType: 'fao',
  metaKey: 'widget_forest_cover_fao',
  sortOrder: {
    landCover: 5
  },
  hideSettings: true,
  sentences: {
    globalInitial:
      'FAO data from 2015 shows that there are {extent} of forest {location}, with primary forest occupying {primaryPercent} of the world.',
    globalNoPrimary:
      'FAO data from 2015 shows that there are {extent} of forest {location}, which occupies {primaryPercent} of the world.',
    initial:
      'FAO data from 2015 shows that {location} contains {extent} of forest, with primary forest occupying {primaryPercent} of the country.',
    noPrimary:
      'FAO data from 2015 shows that {location} contains {extent} of forest, which occupies {primaryPercent} of the country.'
  }
};
