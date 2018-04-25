export const initialState = {
  title: 'Plantations extent',
  config: {
    size: 'small',
    categories: ['land-use'],
    admins: ['country', 'region', 'subRegion'],
    selectors: ['types'],
    showIndicators: ['plantations'],
    type: 'plantations',
    layers: ['plantations_by_type', 'plantations_by_species'],
    metaKey: 'widget_plantation_extent',
    sortOrder: {
      landUse: 1
    },
    sentences: {
      initialSpecies:
        'In {location}, {firstSpecies} and {secondSpecies} represent the largest plantation area by {type}, spanning {extent}ha.',
      singleSpecies:
        'In {location}, {firstSpecies} represent the largest plantation area by {type}, spanning {extent}ha.',
      remainingSpecies:
        'The remaining {other}ha is distributed between {count} other plantation species.',
      initialTypes:
        'In {location}, the largest plantation area by type are {topType}, spanning {extent}ha.'
    }
  },
  settings: {
    threshold: 0,
    type: 'bound2',
    layers: ['plantations_by_species']
  },
  enabled: true
};
