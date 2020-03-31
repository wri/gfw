import moment from 'moment';

import { fetchAnalysisEndpoint } from 'services/analysis';
import { fetchGLADLatest } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  GLAD_DEFORESTATION_ALERTS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  GLAD_ALERTS
} from 'data/layers';

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
    summary: 8,
    forestChange: 12
  },
  visible: ['dashboard', 'analysis'],
  chartType: 'composedChart',
  sentence:
    '{count} deforestation alerts detected in {location} in the last 7 days, compared to a weekly average of {weeklyMean} in the last year.',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      dataset: GLAD_DEFORESTATION_ALERTS_DATASET,
      layers: [GLAD_ALERTS]
    }
  ],
  settings: {
    period: 'week',
    weeks: 1
  },
  getData: params =>
    fetchGLADLatest(params).then(latest => {
      const latestDate =
        latest && latest.attributes && latest.attributes.updatedAt;
      const dates = [
        latestDate,
        moment(latestDate)
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
      }).then(response => ({
        alerts: response.data.data.attributes.value,
        latestDate,
        settings: { latestDate }
      }));
    }),
  getWidgetProps
};
