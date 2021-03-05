import { all, spread } from 'axios';
import moment from 'moment';
import tropicalIsos from 'data/tropical-isos.json';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FIRES_VIIRS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FIRES_ALERTS_VIIRS,
} from 'data/layers';

// function for OTF analysis
import { fetchAnalysisEndpoint } from 'services/analysis';

// function for retreiving glad alerts from tables
import { fetchVIIRSAlertsSum } from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

export default {
  widget: 'firesAlertsSimple',
  title: 'Fire alerts in {location}',
  sentence: {
    default:
      'There were {count} fire alerts reported in {location} between {startDate} and {endDate}, of which {highConfidencePercentage} were {high confidence alerts}.',
    withInd:
      'There were {count} fire alerts reported in {indicator} in {location} between {startDate} and {endDate}, of which {highConfidencePercentage} were {high confidence alerts}.',
  },
  metaKey: 'widget_deforestation_graph',
  large: false,
  visible: ['dashboard', 'analysis'],
  colors: 'fires',
  chartType: 'pieChart',
  source: 'gadm',
  dataType: 'fires',
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
      dataset: FIRES_VIIRS_DATASET,
      layers: [FIRES_ALERTS_VIIRS],
    },
  ],
  sortOrder: {
    summary: 999,
    forestChange: 999,
  },
  pendingKeys: [],
  refetchKeys: ['forestType', 'landCategory', 'startDate', 'endDate'],
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
    },
    {
      key: 'dateRange',
      label: 'Range',
      endKey: 'endDate',
      startKey: 'startDate',
      type: 'datepicker',
    },
  ],
  // where should we see this widget
  whitelists: {
    adm0: tropicalIsos,
  },
  // initial settings
  settings: {
    dataset: 'viirs',
  },
  getData: (params) => {
    params.startDate = '2020-01-30';
    params.endDate = '2021-01-30';
    if (shouldQueryPrecomputedTables(params)) {
      return all([
        fetchVIIRSAlertsSum(params),
      ]).then(
        spread((fires) => {
          const firesData = fires.data && fires.data.data;
          console.log('firesData', firesData);
          let data = {};
          if (firesData) {
            data = {
              alerts: firesData
          };
          return {
            data,
          };
        };
        })
      )
    };

    return all([
      fetchAnalysisEndpoint({
        ...params,
        params,
        name: 'viirs-alerts',
        slug: 'viirs-active-fires',
        version: 'v1',
        aggregate: true,
        aggregateBy: 'day',
      }),
    ]).then(
      spread((alertsResponse) => {
        const alerts = alertsResponse.data.data.attributes.value;
        const { downloadUrls } = alertsResponse.data.data.attributes;
        return {
          alerts:
            alerts &&
            alerts.map((d) => ({
              ...d,
              alerts: d.count,
            })),
          downloadUrls,
        };
      })
    );
  },
  // getDataURL: (params) => [fetchGladAlerts({ ...params, download: true })],
  getWidgetProps,
  // parseInteraction: (payload) => {
  //   if (payload) {
  //     const startDate = moment().year(payload.year).day(payload.day);
  //     return {
  //       startDate: startDate.format('YYYY-MM-DD'),
  //       endDate: endDate.format('YYYY-MM-DD'),
  //       updateLayer: true,
  //       ...payload,
  //     };
  //   }
  //   return {};
  // },
};
