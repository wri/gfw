import { getFAOEmployment } from 'services/forest-data';

import getWidgetProps from './selectors';

export default {
  widget: 'forestryEmployment',
  title: 'Forestry Employment in {location}',
  categories: ['land-use'],
  types: ['country'],
  admins: ['adm0'],
  settingsConfig: [
    {
      key: 'year',
      label: 'year',
      options: [2000, 2010, 2015].map((y) => ({ label: y, value: y })),
      type: 'select',
    },
  ],
  chartType: 'pieChart',
  dataType: 'fao',
  metaKey: 'widget_forestry_employment',
  sortOrder: {
    landUse: 3,
  },
  settings: {
    year: 2015,
    unit: '%',
  },
  colors: 'forestryEmployment',
  sentences: {
    initial:
      'According to the FAO there were {numPeople} people employed in {location} Forestry sector in {year}.',
    withFemales:
      'According to the FAO, there were {numPeople} people employed in {location} Forestry sector in {year}, of which {femalePercent} were female.',
  },
  getData: (params) => getFAOEmployment(params),
  getDataURL: (params) => [getFAOEmployment({ ...params, download: true })],
  getWidgetProps,
};
