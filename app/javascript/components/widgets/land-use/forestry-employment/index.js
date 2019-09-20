import { getFAOEcoLive } from 'services/forest-data';

import getWidgetProps from './selectors';

export default {
  widget: 'forestryEmployment',
  title: 'Forestry Employment in {location}',
  categories: ['land-use'],
  types: ['country'],
  admins: ['adm0'],
  options: {
    years: [1990, 2000, 2005, 2010]
  },
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['ha', '%']
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch'
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  chartType: 'pieChart',
  dataType: 'fao',
  metaKey: 'widget_forestry_employment',
  sortOrder: {
    landUse: 3
  },
  settings: {
    year: 2010,
    unit: ''
  },
  colors: 'employment',
  sentences: {
    initial:
      'According to the FAO there were {value} people employed in {location} Forestry sector in {year}.',
    withFemales:
      'According to the FAO there were {value} people employed in {location} Forestry sector in {year}, of which {percent} were female.'
  },
  getData: params =>
    getFAOEcoLive(params.token).then(response => response.data.rows),
  getWidgetProps
};
