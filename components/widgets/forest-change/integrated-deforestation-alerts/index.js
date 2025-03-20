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

import { handleGfwParamsMeta } from 'utils/gfw-meta';

import find from 'lodash/find';
import sumBy from 'lodash/sumBy';

import moment from 'moment';

import { gte, lte, eq } from 'utils/sql';
import OTF from 'services/otfv2';

import { isMapPage } from 'utils/location';
import { handleAlertSystem } from 'components/widgets/utils/alertSystem';

// imported functions for retreiving glad alerts from tables
import { fetchIntegratedAlerts } from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

const setStartDateByAlertSystem = (alertSystem, params, selectedDate) => {
  const possibleStartDate =
    alertSystem === 'glad_l' ? '2021-01-01' : '2019-01-01';
  const possibleStartDateMoment = moment(possibleStartDate);
  const startDateMoment = params?.startDate
    ? moment(params?.startDate)
    : possibleStartDateMoment;
  const diff = possibleStartDateMoment.diff(startDateMoment, 'days');

  return {
    startDate: diff > 0 ? possibleStartDate : selectedDate,
    possibleStartDate,
  };
};

export default {
  widget: 'integratedDeforestationAlerts',
  published: true,
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
    noReportedAlerts:
      'There were {total} deforestation alerts reported in {location} between {startDate} and {endDate}.',
  },
  metaKey: (params) => {
    const alertSystem = handleAlertSystem(params, 'deforestationAlertsDataset');
    let metaKey = 'gfw_integrated_alerts';
    if (alertSystem === 'glad_l') {
      metaKey = 'umd_landsat_alerts';
    }

    if (alertSystem === 'glad_s2') {
      metaKey = 'umd_glad_sentinel2_alerts';
    }

    if (alertSystem === 'radd') {
      metaKey = 'wur_radd_alerts';
    }
    return metaKey;
  },
  large: false,
  visible: ['dashboard', 'analysis'],
  colors: 'loss',
  chartType: 'pieChart',
  source: 'gadm',
  dataType: 'integration_alerts',
  categories: ['summary', 'forest-change'],
  subcategories: ['forest-loss'],
  types: ['country', 'geostore', 'wdpa', 'aoi', 'use'],
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
    canDownloadUnsaved: true,
  },
  getData: async (params) => {
    // Gets pre-fetched GLAD-related metadata from the state...
    const { GLAD } = await handleGfwParamsMeta(params); // 'true' means getting last update from integrated alerts API in GFW.org
    const alertSystem = handleAlertSystem(params, 'deforestationAlertsDataset');

    // extract relevant metadata
    const defaultStartDate = GLAD?.defaultStartDate;
    const defaultEndDate = GLAD?.defaultEndDate;
    const selectedDate = params?.startDate || defaultStartDate;
    const endDate = params?.endDate || defaultEndDate;

    const isAoi = params?.locationType === 'aoi';
    const status = params?.status || 'unsaved';
    const isAnalysis = shouldQueryPrecomputedTables(params);

    // overriding start date (FLAG-593)
    const { startDate, possibleStartDate } = setStartDateByAlertSystem(
      alertSystem,
      params,
      selectedDate
    );

    // Decide if we are in Dashboards, AoI or Map page i.e. do we do OTF or not?
    // if is otf && isAoi && geostore is not saved, we do default analysis and not otf
    if (isAnalysis) {
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
              minDate: possibleStartDate,
              maxDate: defaultEndDate,
            },
          };
        }
        return data;
      });
    }

    const {
      geostore: { id, hash },
    } = params;
    const geostoreId = hash || id;

    // Stop if geostoreId undefined
    if (geostoreId.length <= 0) return null;

    // Default all integrated alerts
    let dataset = 'gfw_integrated_alerts';

    if (alertSystem === 'glad_l') {
      dataset = 'umd_glad_landsat_alerts';
    }

    if (alertSystem === 'glad_s2') {
      dataset = 'umd_glad_sentinel2_alerts';
    }

    if (alertSystem === 'radd') {
      dataset = 'wur_radd_alerts';
    }

    // OTF analysis

    // If area is saved, point OTF to different dataset
    if (isAoi && status === 'saved') {
      if (alertSystem === 'glad_l') {
        dataset = 'geostore__glad__daily_alerts';
      } else {
        dataset = 'geostore__integrated_alerts__daily_alerts';
      }
    }

    const OtfAnalysis = new OTF(`/dataset/${dataset}/latest/query`);

    if (isAoi && status === 'saved' && alertSystem === 'glad_l') {
      OtfAnalysis.select(
        'umd_glad_landsat_alerts__confidence, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha'
      );
    }
    if (isAoi && status === 'saved' && alertSystem === 'glad_s2') {
      OtfAnalysis.select(
        'umd_glad_sentinel2_alerts__confidence, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha'
      );
    }
    if (isAoi && status === 'saved' && alertSystem === 'radd') {
      OtfAnalysis.select(
        'wur_radd_alerts__confidence, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha'
      );
    }
    if (isAoi && status === 'saved' && alertSystem === 'all') {
      OtfAnalysis.select(
        'gfw_integrated_alerts__confidence, SUM(alert__count) as alert__count, SUM(alert_area__ha) as alert_area__ha'
      );
    }
    if (!isAnalysis || (isAoi && status !== 'saved')) {
      OtfAnalysis.select('count(*), SUM(area__ha)');
    }

    if (isAoi && status === 'saved' && alertSystem === 'glad_l') {
      OtfAnalysis.where([
        { umd_glad_landsat_alerts__date: gte`${startDate}` },
        { umd_glad_landsat_alerts__date: lte`${endDate}` },
        { geostore__id: eq`${geostoreId}` },
      ]);
    }

    if (isAoi && status === 'saved' && alertSystem === 'glad_s2') {
      OtfAnalysis.where([
        { umd_glad_sentinel2_alerts__date: gte`${startDate}` },
        { umd_glad_sentinel2_alerts__date: lte`${endDate}` },
        { geostore__id: eq`${geostoreId}` },
      ]);
    }

    if (isAoi && status === 'saved' && alertSystem === 'radd') {
      OtfAnalysis.where([
        { wur_radd_alerts__date: gte`${startDate}` },
        { wur_radd_alerts__date: lte`${endDate}` },
        { geostore__id: eq`${geostoreId}` },
      ]);
    }

    if (isAoi && status === 'saved' && alertSystem === 'all') {
      OtfAnalysis.where([
        { gfw_integrated_alerts__date: gte`${startDate}` },
        { gfw_integrated_alerts__date: lte`${endDate}` },
        { geostore__id: eq`${geostoreId}` },
      ]);
    }

    if (!isAnalysis || (isAoi && status !== 'saved')) {
      OtfAnalysis.where([
        { [`${dataset}__date`]: gte`${startDate}` },
        { [`${dataset}__date`]: lte`${endDate}` },
      ]);
    }

    if (isAoi && status === 'saved' && alertSystem === 'glad_l') {
      OtfAnalysis.groupBy([' umd_glad_landsat_alerts__confidence']);
    }
    if (isAoi && status === 'saved' && alertSystem === 'glad_s2') {
      OtfAnalysis.groupBy([' umd_glad_sentinel2_alerts__confidence']);
    }
    if (isAoi && status === 'saved' && alertSystem === 'radd') {
      OtfAnalysis.groupBy([' wur_radd_alerts__confidence']);
    }
    if (isAoi && status === 'saved' && alertSystem === 'all') {
      OtfAnalysis.groupBy(['gfw_integrated_alerts__confidence']);
    }
    if (!isAnalysis || (isAoi && status !== 'saved')) {
      OtfAnalysis.groupBy([`${dataset}__confidence`]);
    }

    // TODO - Change logic for gestoreId and origin
    if (!isAoi || (isAoi && status !== 'saved')) {
      OtfAnalysis.geostore({
        id: geostoreId,
        origin: 'rw',
      });
    }

    const otfData = await OtfAnalysis.fetch();

    let high = find(otfData?.data, { [`${dataset}__confidence`]: 'high' });
    let highest = find(otfData?.data, {
      [`${dataset}__confidence`]: 'highest',
    });
    let nominal = find(otfData?.data, {
      [`${dataset}__confidence`]: 'nominal',
    });

    if (isAoi && status === 'saved' && alertSystem === 'glad_l') {
      high = find(otfData?.data, {
        [`umd_glad_landsat_alerts__confidence`]: 'high',
      });
      highest = find(otfData?.data, {
        [`umd_glad_landsat_alerts__confidence`]: 'highest',
      });
      nominal = find(otfData?.data, {
        [`umd_glad_landsat_alerts__confidence`]: 'nominal',
      });
    }
    if (isAoi && status === 'saved' && alertSystem === 'glad_s2') {
      high = find(otfData?.data, {
        [`umd_glad_sentinel2_alerts__confidence`]: 'high',
      });
      highest = find(otfData?.data, {
        [`umd_glad_sentinel2_alerts__confidence`]: 'highest',
      });
      nominal = find(otfData?.data, {
        [`umd_glad_sentinel2_alerts__confidence`]: 'nominal',
      });
    }
    if (isAoi && status === 'saved' && alertSystem === 'radd') {
      high = find(otfData?.data, { [`wur_radd_alerts__confidence`]: 'high' });
      highest = find(otfData?.data, {
        [`wur_radd_alerts__confidence`]: 'highest',
      });
      nominal = find(otfData?.data, {
        [`wur_radd_alerts__confidence`]: 'nominal',
      });
    }
    if (isAoi && status === 'saved' && alertSystem === 'all') {
      high = find(otfData?.data, {
        [`gfw_integrated_alerts__confidence`]: 'high',
      });
      highest = find(otfData?.data, {
        [`gfw_integrated_alerts__confidence`]: 'highest',
      });
      nominal = find(otfData?.data, {
        [`gfw_integrated_alerts__confidence`]: 'nominal',
      });
    }

    let totalAreaHa = 0;
    if (isAoi && status === 'saved') {
      totalAreaHa = sumBy(otfData?.data, 'alert_area__ha');
    } else {
      totalAreaHa = sumBy(otfData?.data, 'area__ha');
    }

    let sum = 0;

    if (params.confirmedOnly === 1) {
      sum = (high?.count || 0) + (highest?.count || 0);
    } else {
      sum = (high?.count || 0) + (highest?.count || 0) + (nominal?.count || 0);
    }

    if (isAoi && status === 'saved') {
      sum =
        (high?.alert__count || 0) +
        (highest?.alert__count || 0) +
        (nominal?.alert__count || 0);
    }

    let highCount = high?.count || 0;
    let highestCount = highest?.count || 0;
    let nominalCount = nominal?.count || 0;

    if (isAoi && status === 'saved') {
      highCount = high?.alert__count || 0;
      highestCount = highest?.alert__count || 0;
      nominalCount = nominal?.alert__count || 0;
    }

    return {
      alerts: {
        otf: true,
        alertSystem,
        totalArea: totalAreaHa,
        confidence: params.confirmedOnly === 1,
        sum,
        highCount,
        highestCount,
        nominalCount,
        allAlerts: [{ alert__count: sum }],
      },
      settings: {
        startDate,
        endDate,
      },
      options: {
        minDate: possibleStartDate,
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
  getDataURL: async (params) => {
    const { GLAD } = await handleGfwParamsMeta(params);
    const defaultStartDate = GLAD?.defaultStartDate;
    const defaultEndDate = GLAD?.defaultEndDate;
    const selectedDate = params?.startDate || defaultStartDate;
    const endDate = params?.endDate || defaultEndDate;
    const alertSystem = handleAlertSystem(params, 'deforestationAlertsDataset');

    // overriding start date (FLAG-593)
    const { startDate } = setStartDateByAlertSystem(
      alertSystem,
      params,
      selectedDate
    );

    let table = 'gfw_integrated_alerts';
    if (alertSystem === 'glad_l') {
      table = 'umd_glad_landsat_alerts';
    }
    if (alertSystem === 'glad_s2') {
      table = 'umd_glad_sentinel2_alerts';
    }
    if (alertSystem === 'radd') {
      table = 'wur_radd_alerts';
    }

    const {
      geostore: { id, hash },
    } = params;
    const geostoreId = hash || id;

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
