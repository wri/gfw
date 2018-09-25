export default {
  widget: 'treeLossTsc',
  title: {
    initial: 'Annual tree cover loss by dominant driver in {location}',
    global: 'Global annual tree cover loss by dominant driver'
  },
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  analysis: true,
  options: {
    tscDriverGroups: true,
    thresholds: true,
    startYears: true,
    endYears: true,
    yearsRange: [2001, 2015]
  },
  layers: ['loss_by_driver', 'dcb082a9-6fd7-4564-9110-ddf5d3d6681e'],
  metaKey: 'widget_tsc_drivers',
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
