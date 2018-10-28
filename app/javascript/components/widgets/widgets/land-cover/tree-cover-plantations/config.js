export default {
  widget: 'treeCoverPlantations',
  title: 'Plantations in {location}',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    types: true
  },
  colors: 'plantations',
  layers: ['plantations_by_type', 'plantations_by_species'],
  metaKey: 'widget_plantation_extent',
  sortOrder: {
    landCover: 100
  },
  sentences: {
    initialSpecies:
      'In {location}, {firstSpecies} and {secondSpecies} represent the largest plantation area by {type}, spanning {extent} and {percent} of land area.',
    singleSpecies:
      'In {location}, {firstSpecies} represent the largest plantation area by {type}, spanning {extent} and {percent} of land area.',
    initialTypes:
      'In {location}, the largest plantation area by type is {topType}, spanning {extent} and {percent} of land area.'
  },
  whitelists: {
    indicators: ['plantations']
  }
};
