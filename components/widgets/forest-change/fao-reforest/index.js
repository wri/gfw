import { all, spread } from 'axios';
import { getFAOReforest } from 'services/forest-data';

import getWidgetProps from './selectors';

export default {
  widget: 'faoReforest',
  title: {
    global: 'Global FAO reforestation',
    initial: 'FAO reforestation in {location}',
  },
  categories: ['forest-change'],
  subcategories: ['forest-gain'],
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  settingsConfig: [
    {
      key: 'yearRange',
      label: 'period',
      type: 'select',
      clearable: false,
      border: true,
    },
  ],
  chartType: 'rankedList',
  dataType: 'fao',
  metaKey: 'widget_rate_of_restoration_fao',
  sortOrder: {
    forestChange: 8,
  },
  refetchKeys: ['yearRange'],
  colors: 'gain',
  sentences: {
    globalInitial:
      'According to the FAO, the {location} rate of reforestation in between {startYearRange} and {endYearRange} was {rate} per year.',
    initial:
      'According to the FAO, the rate of reforestation in {location} was {rate} per year between {startYearRange} and {endYearRange}.',
    noReforest: 'No reforestation data in {location}.',
  },
  settings: {
    yearRange: '2015-2020',
    unit: 'ha/year',
    pageSize: 5,
    page: 0,
  },
  getData: (params) =>
    all([getFAOReforest(params)]).then(
      spread((getFAOReforestResponse) => {
        const fao = getFAOReforestResponse;

        return { fao };
      })
    ),
  getDataURL: (params) => [getFAOReforest({ ...params, download: true })],
  getWidgetProps,
};
