import { all, spread } from 'axios';
import moment from 'moment';
import tropicalIsos from 'data/tropical-isos.json';

import {
  POLITICAL_BOUNDARIES_DATASET,
  GLAD_DEFORESTATION_ALERTS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  GLAD_ALERTS,
} from 'data/layers';

// function for OTF analysis
import { fetchAnalysisEndpoint } from 'services/analysis';

// function for retreiving glad alerts from tables
import { fetchGladAlertsSum, fetchGLADLatest } from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

export default {
  widget: 'gladAlertsSimple',
  title: 'Deforestation alerts in {location}',
  sentence: {
    default:
      'There were {count} GLAD alerts reported between {startDate} and {endDate}. Of these {confirmedPercentage} were confirmed alerts.',
    withInd:
      'There were {count} GLAD alerts reported in {indicator} between {startDate} and {endDate}. Of these {confirmedPercentage} were confirmed alerts.',
  },
  metaKey: 'widget_deforestation_graph',
  large: true,
  visible: ['dashboard', 'analysis'],
  colors: 'loss',
  chartType: 'pieChart',
  source: 'gadm',
  dataType: 'glad',
  categories: ['summary', 'forest-change'],
  types: ['country', 'geostore', 'wdpa', 'aoi', 'use'],
  admins: ['adm0', 'adm1', 'adm2'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: GLAD_DEFORESTATION_ALERTS_DATASET,
      layers: [GLAD_ALERTS],
    },
  ],
  sortOrder: {
    summary: 6,
    forestChange: 10,
  },
  pendingKeys: ['weeks'],
  refetchKeys: ['forestType', 'landCategory'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    }
  ],
  // where should we see this widget
  whitelists: {
    adm0: tropicalIsos,
  },
  // initial settings
  settings: {
    period: 'week',
    weeks: 13,
    dataset: 'glad',
  },
  getData: (params) => {
    if (shouldQueryPrecomputedTables(params)) {
      params.startDate = '2021-01-01';
      params.endDate = '2021-01-20';
      console.log('params', params)
      return all([fetchGladAlertsSum(params), fetchGLADLatest(params)]).then(
        spread((alerts, latest) => {
          console.log('alerts index', alerts)
          const gladsData = alerts && alerts.data.data;
          let data = {};
          if (gladsData && latest) {
            const latestDate =
              latest && latest.attributes && latest.attributes.updatedAt;

            data = {
              alerts: gladsData,
              latest: latestDate,
              settings: { latestDate },
            };
          }

          return data;
        })
      );
    }

    return all([
      fetchAnalysisEndpoint({
        ...params,
        params,
        name: 'glad-alerts',
        slug: 'glad-alerts',
        version: 'v1',
        aggregate: true,
        aggregateBy: 'week',
      }),
      fetchGLADLatest(params),
    ]).then(
      spread((alertsResponse, latestResponse) => {
        const alerts = alertsResponse.data.data.attributes.value;
        const latestDate = latestResponse.attributes.updatedAt;
        const { downloadUrls } = alertsResponse.data.data.attributes;

        return {
          alerts:
            alerts &&
            alerts.map((d) => ({
              ...d,
              alerts: d.count,
            })),
          latest: latestDate,
          settings: { latestDate },
          downloadUrls,
        };
      })
    );
  },
  // getDataURL: (params) => [fetchGladAlerts({ ...params, download: true })],
  getWidgetProps,
  parseInteraction: (payload) => {
    if (payload) {
      const startDate = moment().year(payload.year).week(payload.week);

      return {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: startDate.add(7, 'days').format('YYYY-MM-DD'),
        updateLayer: true,
        ...payload,
      };
    }
    return {};
  },
};
