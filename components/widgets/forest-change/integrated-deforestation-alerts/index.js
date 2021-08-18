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

import { isMapPage } from 'utils/location';

// imported functions for retreiving glad alerts from tables
import { fetchIntegratedAlerts } from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

export default {
  widget: 'integratedDeforestationAlerts',
  title: 'TEST Integrated Deforestation alerts in {location}',
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
    dataset: 'glad',
  },
  getData: (params) => {
    // Gets pre-fetched GLAD-related metadata from the state...
    const { GLAD } = params.GFW_META.datasets;

    // extract relevant metadata
    const defaultStartDate = GLAD?.defaultStartDate;
    const defaultEndDate = GLAD?.defaultEndDate;
    const startDate = params?.startDate || defaultStartDate;
    const endDate = params?.endDate || defaultEndDate;

    // Decide if we are in Dashboards, AoI or Map page i.e. do we do OTF or not?
    if (shouldQueryPrecomputedTables(params)) {
      // function reference to parse fetch
      return fetchIntegratedAlerts({
        // widget settings passed to the fetch function from the config above as well as the state
        ...params,
        startDate: '2021-01-01',
        endDate: '2021-01-10',
        // once fetch resolves... then do the following. Usually, some basic parsing
      }).then((alerts) => {
        const integratedAlertsData = alerts && alerts.data.data;
        let data = {};
        if (integratedAlertsData && GLAD) {
          data = {
            alerts: integratedAlertsData,
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
    return null;
    // // No OTF yet
    // const geostoreId = params?.geostore?.hash;
    // return fetchGladAlertsSumOTF({
    //   ...params,
    //   startDate,
    //   endDate,
    //   geostoreId,
    //   staticStatement: {
    //     // overrides tables and/or sql
    //     table: 'umd_glad_landsat_alerts',
    //   },
    // }).then((alerts) => {
    //   const gladsData = alerts && alerts.data.data;
    //   let data = {};
    //   if (gladsData && GLAD) {
    //     data = {
    //       alerts: [
    //         {
    //           alerts: gladsData
    //             ? gladsData.filter((d) => d.confirmed === false).length
    //             : 0,
    //           confirmed: false,
    //         },
    //         {
    //           alerts: gladsData
    //             ? gladsData.filter((d) => d.confirmed === true).length
    //             : 0,
    //           confirmed: true,
    //         },
    //       ],
    //       settings: {
    //         startDate,
    //         endDate,
    //       },
    //       options: {
    //         minDate: '2015-01-01',
    //         maxDate: defaultEndDate,
    //       },
    //     };
    //   }
    //   return data;
    // });
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
      fetchIntegratedAlerts({
        ...params,
        startDate,
        endDate,
        geostoreId,
        download: true,
        staticStatement: {
          // overrides tables and/or sql
          // append: true, If active, we will utalise the old location select logic with our statement
          // If download===true, apply to "download" endpoint
          table: 'umd_glad_landsat_alerts',
        },
      }),
    ];
  },
  getWidgetProps,
};
