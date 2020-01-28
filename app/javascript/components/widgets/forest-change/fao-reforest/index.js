import { getFAOReforest } from 'services/forest-data';

import getWidgetProps from './selectors';

export default {
  widget: 'faoReforest',
  title: {
    global: 'Global FAO reforestation',
    initial: 'FAO reforestation in {location}'
  },
  categories: ['forest-change'],
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  settingsConfig: [
    {
      key: 'period',
      label: 'period',
      type: 'select'
    }
  ],
  chartType: 'rankedList',
  dataType: 'fao',
  metaKey: 'widget_rate_of_restoration_fao',
  sortOrder: {
    forestChange: 8
  },
  refetchKeys: ['period'],
  colors: 'gain',
  sentences: {
    globalInitial:
      'According to the FAO, the {location} rate of reforestation in {year} was {rate} per year.',
    initial:
      'According to the FAO, the rate of reforestation in {location} was {rate} per year in {year}.',
    noReforest: 'No reforestation data in {location}.'
  },
  settings: {
    period: 2010,
    unit: 'ha/year',
    pageSize: 5,
    page: 0
  },
  getData: params =>
    getFAOReforest({ ...params }).then(response => {
      const data = response.data.rows;
      const hasCountryData = (data.length && data.find(d => d.iso)) || null;
      return hasCountryData ? data : {};
    }),
  getDataURL: params => [getFAOReforest({ ...params, download: true })],
  getWidgetProps
};
