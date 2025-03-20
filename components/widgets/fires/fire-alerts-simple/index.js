import tropicalIsos from 'data/tropical-isos.json';

import { handleGfwParamsMeta } from 'utils/gfw-meta';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FIRES_VIIRS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FIRES_ALERTS_VIIRS,
} from 'data/layers';

import { isMapPage } from 'utils/location';

// function for retreiving glad alerts from tables
import {
  fetchVIIRSAlertsSum,
  fetchVIIRSAlertsSumOTF,
} from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

export default {
  widget: 'firesAlertsSimple',
  title: 'Fire alerts in {location}',
  sentence: {
    default:
      'There were {count} {dataset} fire alerts reported in {location} between {startDate} and {endDate}, of which {highConfidencePercentage} were {high confidence alerts}.',
    withInd:
      'There were {count} {dataset} fire alerts reported in {indicator} in {location} between {startDate} and {endDate}, of which {highConfidencePercentage} were {high confidence alerts}.',
  },
  metaKey: 'widget_fire_alert_location',
  large: false,
  visible: ['dashboard', 'analysis'],
  colors: 'fires',
  chartType: 'pieChart',
  dataType: 'fires',
  categories: ['summary', 'fires'],
  types: ['geostore', 'country', 'wdpa', 'aoi', 'use'],
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
    summary: 9999,
    fires: 6,
  },
  pendingKeys: [],
  refetchKeys: [
    'dataset',
    'forestType',
    'landCategory',
    'startDate',
    'endDate',
  ],
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
      key: 'dataset',
      whitelist: ['viirs', 'modis'],
      label: 'fires dataset',
      type: 'select',
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
      !props.settings.forestType &&
      !props.settings.landCategory &&
      !isMapPage(props?.location),
  },
  // where should we see this widget
  whitelists: {
    adm0: tropicalIsos,
  },
  // initial settings
  settings: {
    dataset: 'viirs',
  },
  getData: async (params) => {
    const { VIIRS } = await handleGfwParamsMeta(params);
    const defaultStartDate = VIIRS?.defaultStartDate;
    const defaultEndDate = VIIRS?.defaultEndDate;
    const startDate = params?.startDate || defaultStartDate;
    const endDate = params?.endDate || defaultEndDate;
    const {
      geostore: { id, hash },
    } = params;
    const geostoreId = hash || id;

    if (shouldQueryPrecomputedTables(params)) {
      return fetchVIIRSAlertsSum({
        ...params,
        startDate,
        endDate,
      }).then((alerts) => {
        const firesData = alerts && alerts.data.data;
        let data = {};
        if (firesData && VIIRS) {
          data = {
            alerts: firesData,
            settings: {
              startDate,
              endDate,
            },
            options: {
              minDate: '2000-01-01',
              maxDate: defaultEndDate,
            },
          };
        }
        return data;
      });
    }

    return fetchVIIRSAlertsSumOTF({
      ...params,
      startDate,
      endDate,
      geostoreId,
      staticStatement: {
        // append: true, If active, we will utalise the old location select logic with our statement
        statement: 'alert__date',
        table: 'nasa_viirs_fire_alerts',
      },
    }).then((alertsResponse) => {
      const alerts = alertsResponse.data.data;
      let data = {};
      if (alerts && VIIRS) {
        data = {
          alerts: alerts.map((d) => ({
            ...d,
            alerts: d.count,
          })),
          settings: {
            startDate,
            endDate,
          },
          options: {
            minDate: '2000-01-01',
            maxDate: defaultEndDate,
          },
        };
      }
      return data;
    });
  },
  maxDownloadSize: {
    maxSize: 1e5,
    key: 'alerts',
    subKey: 'alert__count',
  },
  getDataURL: async (params) => {
    const { VIIRS } = await handleGfwParamsMeta(params);
    const {
      startDate = VIIRS?.defaultStartDate,
      endDate = VIIRS?.defaultEndDate,
    } = params;
    const {
      geostore: { id, hash },
    } = params;
    const geostoreId = hash || id;

    return [
      fetchVIIRSAlertsSumOTF({
        ...params,
        startDate,
        endDate,
        geostoreId,
        download: true,
        staticStatement: {
          // append: true, If active, we will utalise the old location select logic with our statement
          statement: 'latitude, longitude, alert__date',
          table: 'nasa_viirs_fire_alerts',
        },
      }),
    ];
  },
  getWidgetProps,
};
