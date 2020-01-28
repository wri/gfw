export default {
  widget: 'treeLossTsc',
  title: {
    initial: 'Annual tree cover loss by dominant driver in {location}',
    global: 'Global annual tree cover loss by dominant driver'
  },
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  options: {
    tscDriverGroups: true,
    thresholds: true,
    startYears: true,
    endYears: true,
    yearsRange: [2001, 2015],
    forestTypes: ['tsc']
  },
  datasets: [
    // loss tsc
    {
      dataset: '89755b9f-df05-4e22-a9bc-05217c8eafc8',
      layers: ['fd05bc2c-6ade-408c-862e-7318557dd4fc']
    }
  ],
  metaKey: 'widget_tsc_drivers',
  sortOrder: {
    summary: 1,
    forestChange: 1,
    global: 1
  },
  sentences: {
    initial:
      'In {location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
    noLoss:
      'In {location} from {startYear} to {endYear}, <b>no</b> tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
    globalInitial:
      '{location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.'
  }
};
