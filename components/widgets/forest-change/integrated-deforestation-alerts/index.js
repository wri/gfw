import tropicalIsos from 'data/tropical-isos.json';

import {
  POLITICAL_BOUNDARIES_DATASET,
  INTEGRATED_DEFORESTATION_ALERTS,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  INTEGRATED_ALERTS,
  INTEGRATED_ALERTS_GLADS,
  INTEGRATED_ALERTS_RADD,
  INTEGRATED_ALERTS_GLAD,
} from 'data/layers';

import { handleGladMeta } from 'utils/gfw-meta';

import { gte, lte } from 'utils/sql';
import OTF from 'services/otfv2';

import { isMapPage } from 'utils/location';
import { handleAlertSystem } from 'components/widgets/utils/alertSystem';

// imported functions for retreiving glad alerts from tables
import { fetchIntegratedAlerts } from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

export default {
  widget: 'integratedDeforestationAlerts',
  published: false,
  title: 'Integrated Deforestation alerts in {location}',
  sentence: {
    initial:
      'There were {total} deforestation alerts reported in {location} between {startDate} and {endDate}, {totalArea} of which {highConfPerc} were high confidence alerts detected by a single system and {highestConfPerc} were alerts detected by multiple systems.',
    withInd:
      'There were {total} deforestation alerts reported within {indicator} in {location} between {startDate} and {endDate}, {totalArea} of which {highConfPerc} were high confidence alerts detected by a single system and {highestConfPerc} were alerts detected by multiple systems.',
    singleSystem:
      'There were {total} {system} alerts reported in {location} between {startDate} and {endDate}, {totalArea} of which {highConfPerc} were {highConfidenceAlerts}.',
    singleSystemWithInd:
      'There were {total} {system} alerts reported within {indicator} in {location} between {startDate} and {endDate}, {totalArea} of which {highConfPerc} were {highConfidenceAlerts}.',
    highConf:
      'There were {total} high or highest confidence {system} alerts reported in {location} between {startDate} and {endDate}, {totalArea}.',
  },
  metaKey: 'widget_deforestation_graph',
  large: false,
  visible: ['dashboard', 'analysis'],
  colors: 'loss',
  chartType: 'pieChart',
  source: 'gadm',
  dataType: 'integration_alerts',
  categories: ['summary', 'forest-change'],
  types: ['country', 'geostore', 'wdpa', 'aoi', 'use'], // Country level only for now (no 'geostore', 'wdpa', 'aoi', 'use')
  admins: ['adm0', 'adm1', 'adm2'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // all alert systems
    {
      dataset: INTEGRATED_DEFORESTATION_ALERTS,
      layers: [
        INTEGRATED_ALERTS,
        INTEGRATED_ALERTS_GLADS,
        INTEGRATED_ALERTS_RADD,
        INTEGRATED_ALERTS_GLAD,
      ],
    },
  ],
  sortOrder: {
    summary: 999,
    forestChange: 999,
  },
  pendingKeys: [],
  refetchKeys: [
    'deforestationAlertsDataset',
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
      key: 'dateRange',
      label: 'Range',
      endKey: 'endDate',
      startKey: 'startDate',
      type: 'datepicker',
    },
    {
      key: 'deforestationAlertsDataset',
      label: 'Alert type',
      type: 'select',
    },
  ],
  settingsBtnConfig: {
    text: '+ Select an intersection',
    theme: 'theme-button-medium theme-button-light theme-full-width',
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
    deforestationAlertsDataset: 'all',
  },
  getData: async (params) => {
    // Gets pre-fetched GLAD-related metadata from the state...
    const GLAD = await handleGladMeta(params);
    const alertSystem = handleAlertSystem(params, 'deforestationAlertsDataset');

    // extract relevant metadata
    const defaultStartDate = GLAD?.defaultStartDate;
    const defaultEndDate = GLAD?.defaultEndDate;
    const startDate = params?.startDate || defaultStartDate;
    const endDate = params?.endDate || defaultEndDate;

    // Decide if we are in Dashboards, AoI or Map page i.e. do we do OTF or not?
    if (shouldQueryPrecomputedTables(params)) {
      return fetchIntegratedAlerts({
        // widget settings passed to the fetch function from the config above as well as the state
        ...params,
        alertSystem,
        startDate,
        endDate,
        // once fetch resolves... then do the following. Usually, some basic parsing
      }).then((alerts) => {
        const integratedAlertsData = alerts && alerts.data.data;
        let data = {};
        if (integratedAlertsData && GLAD) {
          data = {
            alerts: {
              allAlerts: integratedAlertsData,
              alertSystem,
              confidence: params.confirmedOnly === 1,
            },
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

    const geostoreId = params?.geostore?.hash;

    // Default all integrated alerts
    let dataset = 'gfw_integrated_alerts';

    if (alertSystem === 'glad_l') {
      dataset = 'umd_glad_landsat_alerts';
    }

    if (alertSystem === 'glad_s') {
      dataset = 'umd_glad_sentinel2_alerts';
    }

    if (alertSystem === 'radd') {
      dataset = 'wur_radd_alerts';
    }

    // OTF analysis
    const OtfAnalysis = new OTF(`/dataset/${dataset}/latest/query`);

    OtfAnalysis.select('count(*)');

    OtfAnalysis.where([
      { [`${dataset}__date`]: gte`${startDate}` },
      { [`${dataset}__date`]: lte`${endDate}` },
    ]);

    OtfAnalysis.groupBy([`${dataset}__confidence`]);

    OtfAnalysis.geostore({
      id: geostoreId,
      origin: 'rw',
    });

    const otfData = await OtfAnalysis.fetch();
    const [high, highest, nominal] = otfData?.data || [];

    return {
      alerts: {
        otf: true,
        alertSystem,
        confidence: params.confirmedOnly === 1,
        sum: (high?.count || 0) + (highest?.count || 0) + (nominal?.count || 0),
        highCount: high?.count || 0,
        highestCount: highest?.count || 0,
        nominalCount: nominal?.count || 0,
      },
      settings: {
        startDate,
        endDate,
      },
      options: {
        minDate: '2015-01-01',
        maxDate: defaultEndDate,
      },
    };
  },
  maxDownloadSize: {
    maxSize: 1e5,
    key: 'alerts',
    subKey: 'allAlerts',
    entryKey: 'alert__count',
  },
  // Downloads
  getDataURL: (params) => {
    const { GLAD } = params.GFW_META.datasets;
    const defaultStartDate = GLAD?.defaultStartDate;
    const defaultEndDate = GLAD?.defaultEndDate;
    const startDate = params?.startDate || defaultStartDate;
    const endDate = params?.endDate || defaultEndDate;
    const geostoreId = params?.geostore?.hash;
    const alertSystem = params?.deforestationAlertsDataset;

    let table = 'gfw_integrated_alerts';
    if (alertSystem === 'glad_l') {
      table = 'umd_glad_landsat_alerts';
    }
    if (alertSystem === 'glad_l') {
      table = 'umd_glad_sentinel2_alerts';
    }
    if (alertSystem === 'radd') {
      table = 'wur_radd_alerts';
    }

    return [
      fetchIntegratedAlerts({
        ...params,
        startDate,
        endDate,
        geostoreId,
        download: true,
        alertSystem,
        staticStatement: {
          // overrides tables and/or sql
          // append: true, If active, we will utalise the old location select logic with our statement
          // If download===true, apply to "download" endpoint
          table,
        },
      }),
    ];
  },
  getWidgetProps,
};
