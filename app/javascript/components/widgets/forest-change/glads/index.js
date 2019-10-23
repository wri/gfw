import moment from 'moment';

import { fetchAnalysisEndpoint } from 'services/analysis';

import getWidgetProps from './selectors';

export default {
  widget: 'glads',
  title: 'Deforestation alerts for the last week in {location}',
  categories: ['forest-change', 'summary'],
  admins: ['adm0', 'adm1', 'adm2'],
  types: ['geostore', 'wdpa', 'use'],
  type: 'loss',
  colors: 'loss',
  sortOrder: {
    summary: 7,
    forestChange: 11
  },
  visible: ['dashboard', 'analysis'],
  chartType: 'composedChart',
  sentence:
    '{count} deforestation alerts detected in {location} in the last 7 days, compared to a weekly average of {weeklyMean} in the last year.',
  datasets: [
    {
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    {
      dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
      layers: ['dd5df87f-39c2-4aeb-a462-3ef969b20b66']
    }
  ],
  settings: {
    period: 'week',
    weeks: 1
  },
  getData: params => {
    const dates = [
      moment().format('YYYY-MM-DD'),
      moment()
        .subtract(1, 'year')
        .format('YYYY-MM-DD')
    ];
    return fetchAnalysisEndpoint({
      ...params,
      params: {
        ...params,
        startDate: dates[1],
        endDate: dates[0]
      },
      name: 'glad-alerts',
      slug: 'glad-alerts',
      version: 'v1',
      aggregate: true,
      aggregateBy: 'day'
    }).then(response => response.data.data.attributes.value);
  },
  getWidgetProps
};
