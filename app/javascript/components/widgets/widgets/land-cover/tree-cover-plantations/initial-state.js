export default {
  title: 'Plantations extent',
  config: {
    size: 'small',
    categories: ['land-cover'],
    admins: ['country', 'region', 'subRegion'],
    selectors: ['types'],
    showIndicators: ['plantations'],
    type: 'plantations',
    layers: ['plantations_by_type', 'plantations_by_species'],
    metaKey: 'widget_plantation_extent',
    sortOrder: {
      landCover: 100
    },
    sentences: {
      initialSpecies:
        'In {location}, {firstSpecies} and {secondSpecies} represent the largest plantation area by {type}, spanning {extent}.',
      singleSpecies:
        'In {location}, {firstSpecies} represent the largest plantation area by {type}, spanning {extent}.',
      remainingSpecies:
        'The remaining {other} is distributed between {count} other plantation species.',
      initialTypes:
        'In {location}, the largest plantation area by type are {topType}, spanning {extent}.'
    }
  },
  settings: {
    threshold: 0,
    type: 'bound2',
    layers: ['plantations_by_species']
  },
  enabled: true
};
