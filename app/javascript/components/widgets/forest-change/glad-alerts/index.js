import { all, spread } from 'axios';
import moment from 'moment';
import tropicalIsos from 'data/tropical-isos.json';

import { fetchAnalysisEndpoint } from 'services/analysis';
import { fetchGladAlerts, fetchGLADLatest } from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

export default {
  widget: 'gladAlerts',
  title: 'Deforestation alerts in {location}',
  sentence: {
    default:
      'There were {count} GLAD alerts reported in the week of the {date}. This was {status} compared to the same week in previous years.',
    withInd:
      'There were {count} GLAD alerts reported in {indicator} in the week of the {date}. This was {status} compared to the same week in previous years.'
  },
  metaKey: 'widget_deforestation_graph',
  large: true,
  visible: ['dashboard', 'analysis'],
  colors: 'loss',
  chartType: 'composedChart',
  source: 'gadm',
  dataType: 'loss',
  categories: ['summary', 'forest-change'],
  types: ['country', 'geostore', 'wdpa', 'use'],
  admins: ['adm0', 'adm1', 'adm2'],
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
  sortOrder: {
    summary: 6,
    forestChange: 9
  },
  pendingKeys: ['weeks'],
  refetchKeys: ['forestType', 'landCategory'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
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
      key: 'weeks',
      label: 'show data for the last',
      type: 'select',
      whitelist: [13, 26, 52],
      noSort: true
    }
  ],
  whitelistType: 'glad',
  whitelists: {
    adm0: tropicalIsos
  },
  settings: {
    period: 'week',
    weeks: 13
  },
  getData: params => {
    if (shouldQueryPrecomputedTables(params)) {
      return all([fetchGladAlerts(params), fetchGLADLatest(params)]).then(
        spread((alerts, latest) => {
          const gladsData = alerts && alerts.data.data;
          let data = {};
          if (gladsData && latest) {
            const latestDate =
              latest && latest.attributes && latest.attributes.updatedAt;

            data = {
              alerts: gladsData,
              latest: latestDate,
              settings: { latestDate }
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
        aggregateBy: 'week'
      }),
      fetchGLADLatest(params)
    ]).then(
      spread((alertsResponse, latestResponse) => {
        const alerts = alertsResponse.data.data.attributes.value;
        const latestDate = latestResponse.attributes.updatedAt;
        const downloadUrls = alertsResponse.data.data.attributes.downloadUrls;

        return {
          alerts:
            alerts &&
            alerts.map(d => ({
              ...d,
              alerts: d.count
            })),
          latest: latestDate,
          settings: { latestDate },
          downloadUrls
        };
      })
    );
  },
  getDataURL: params => [fetchGladAlerts({ ...params, download: true })],
  getWidgetProps,
  parseInteraction: payload => {
    if (payload) {
      const startDate = moment()
        .year(payload.year)
        .week(payload.week);

      return {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: startDate.add(7, 'days').format('YYYY-MM-DD'),
        updateLayer: true,
        ...payload
      };
    }
    return {};
  }
};
