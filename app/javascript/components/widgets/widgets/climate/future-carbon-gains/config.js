export default {
  widget: 'futurecarbongains',
  title: {
    initial: 'Annual tree cover loss by dominant driver in {location}',
    global: 'Global annual tree cover loss by dominant driver'
  },
  categories: ['climate'],
  colors: 'loss',
  types: ['country', 'region'],
  admins: ['adm0', 'adm1', 'adm2'],
  options: {
    tscDriverGroups: true,
    thresholds: true,
    startYears: true,
    endYears: true,
    yearsRange: [2001, 2015]
  },
  layers: [],
  metaKey: 'futurecarbongains',
  sortOrder: {
    summary: 1,
    forestChange: 1,
    global: 1
  },
  sentences: {
    initial:
      'In {location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {permanent deforestation}.',
    noLoss:
      'In {location} from {startYear} to {endYear}, <b>no</b> tree cover loss occurred in areas where the dominant drivers of loss resulted in {permanent deforestation}.',
    globalInitial:
      '{location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {permanent deforestation}.'
  }
};
