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
import { fetchGladAlertsSum } from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

export default {
  widget: 'gladAlertsSimple',
  title: 'Deforestation alerts in {location}',
  sentence: {
    default:
      'There were {count} GLAD alerts reported in {location} between {startDate} and {endDate}, of which {highConfidencePercentage} were {high confidence alerts}.',
    withInd:
      'There were {count} GLAD alerts reported in {indicator} in {location} between {startDate} and {endDate}, of which {highConfidencePercentage} were {high confidence alerts}.',
  },
  metaKey: 'widget_deforestation_graph',
  large: false,
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
  settingsBtnConfig: {
    text: '+ Select an intersection',
    shouldShowButton: (props) =>
      !props.settings.forestType && !props.settings.landCategory,
  },
  // where should we see this widget
  whitelists: {
    adm0: tropicalIsos,
  },
  // initial settings
  settings: {
    dataset: 'glad',
  },
  getData: (params) => {
    const { GLAD } = params.GFW_META.datasets;
    const defaultStartDate = GLAD?.defaultStartDate;
    const defaultEndDate = GLAD?.defaultEndDate;
    const startDate = params?.startDate || defaultStartDate;
    const endDate = params?.endDate || defaultEndDate;
    if (shouldQueryPrecomputedTables(params)) {
      return fetchGladAlertsSum({
        ...params,
        startDate,
        endDate,
      }).then((alerts) => {
        const gladsData = alerts && alerts.data.data;
        let data = {};
        if (gladsData && GLAD) {
          data = {
            alerts: gladsData,
            settings: {
              startDate,
              endDate,
            },
            options: {
              minDate: '2015-01-01',
              maxDate: defaultEndDate,
            },
          };
        }
        return data;
      });
    }
    return fetchAnalysisEndpoint({
      ...params,
      params,
      name: 'glad-alerts',
      slug: 'glad-alerts',
      version: 'v1',
      aggregate: true,
      aggregateBy: 'days',
    }).then((alertsResponse) => {
      const alerts = alertsResponse.data.data.attributes.value;
      const { downloadUrls } = alertsResponse.data.data.attributes;
      return {
        alerts:
          alerts &&
          alerts.map((d) => ({
            ...d,
            alerts: d.count,
          })),
        latest: defaultEndDate,
        settings: { defaultEndDate },
        downloadUrls,
      };
    });
  },
  maxDownloadSize: {
    maxSize: 1e5,
    key: 'alerts',
    subKey: 'alert__count',
  },
  getDataURL: (params) => {
    const { GLAD } = params.GFW_META.datasets;
    const defaultStartDate = GLAD?.defaultStartDate;
    const defaultEndDate = GLAD?.defaultEndDate;
    const startDate = params?.startDate || defaultStartDate;
    const endDate = params?.endDate || defaultEndDate;
    const geostoreId = params?.geostore?.hash;
    return [
      fetchGladAlertsSum({
        ...params,
        startDate,
        endDate,
        geostoreId,
        download: true,
        staticStatement: {
          // append: true, If active, we will utalise the old location select logic with our statement
          download: {
            // Only apply to "download" endpoint
            table: 'umd_glad_landsat_alerts',
          },
        },
      }),
    ];
  },
  getWidgetProps,
};
