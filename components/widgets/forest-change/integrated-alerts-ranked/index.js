import { all, spread } from 'axios';
import tropicalIsos from 'data/tropical-isos.json';

import {
  POLITICAL_BOUNDARIES_DATASET,
  // GLAD_DEFORESTATION_ALERTS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  // GLAD_ALERTS,
} from 'data/layers';

import { handleGladMeta } from 'utils/gfw-meta';

import {
  getExtentGrouped,
  getIntegratedAlertsRanked,
  fetchGladAlerts,
  fetchGLADLatest,
} from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';

import getWidgetProps from './selectors';

export default {
  widget: 'integratedAlertsRanked',
  title: 'Location of integrated deforestation Alerts in {location}',
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
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
      whitelist: ['mining', 'wdpa', 'landmark'],
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'deforestationAlertsDataset',
      label: 'Alert type',
      type: 'select',
    },
    {
      key: 'weeks',
      label: 'show data for the last',
      type: 'select',
      whitelist: [4, 13, 26, 52],
      noSort: true,
    },
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['%', 'ha'],
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  pendingKeys: ['extentYear', 'threshold'],
  refetchKeys: [
    'forestType',
    'landCategory',
    'deforestationAlertsDataset',
    'extentYear',
    'threshold',
  ],
  chartType: 'rankedList',
  metaKey: 'widget_deforestation_alert_location',
  colors: 'loss',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // Replace with 8bits integrated deforestation layer when ready
    // {
    //   dataset: GLAD_DEFORESTATION_ALERTS_DATASET,
    //   layers: [GLAD_ALERTS],
    // },
  ],
  sortOrder: {
    summary: 6,
    forestChange: 10,
  },
  sentences: {
    initial:
      'In the last {timeframe} in {location}, {count} deforestation alerts were detected, which affected an area of approximately {area}. The top {topRegions} accounted for {topPercent} of all deforestation alerts.',
    withInd:
      'In the last {timeframe} in {location}, {count} deforestation alerts were detected within {indicator}, which affected an area of approximately {area}. The top {topRegions} accounted for {topPercent} of all deforestation alerts.',
    singleSystem:
      'In the last {timefrane} in {location}, {count} {system} alerts were detected, which affected an area of approximately {area}. The top {topRegions} accounted for {topPercent} of all {system} alerts.',
    singleSystemWithInd:
      'In the last {timeframe} in {location}, {count} {systme} alerts were detected within {indicator}, which affected an area of approximately {area}. The top {topRegions} accounted for {topPercent} of all {system} alerts.',
  },
  settings: {
    threshold: 30,
    extentYear: 2010,
    unit: 'ha',
    weeks: 4,
    pageSize: 5,
    page: 0,
    ifl: 2016,
    dataset: 'glad',
    deforestationAlertsDataset: 'all',
  },
  whitelists: {
    adm0: tropicalIsos,
  },
  getData: async (params) => {
    // Gets pre-fetched GLAD-related metadata from the state...
    const GLAD = await handleGladMeta(params);

    // extract relevant metadata
    const defaultStartDate = GLAD?.defaultStartDate;
    const defaultEndDate = GLAD?.defaultEndDate;
    const startDate = params?.startDate || defaultStartDate;
    const endDate = params?.endDate || defaultEndDate;
    const geostoreId = params?.geostore?.hash;
    const alertSystem = params?.deforestationAlertsDataset;

    if (shouldQueryPrecomputedTables(params)) {
      return all([
        getIntegratedAlertsRanked({ ...params, startDate, grouped: true, endDate, geostoreId }),
        fetchGLADLatest(params),
        getExtentGrouped(params)
      ]).then(spread((alerts, latest, extent) => {
        const { data } = alerts.data;
        const areas = extent.data.data;
        const latestDate = latest.attributes && latest.attributes.updatedAt;

        // const alertSystem = params?.deforestationAlertsDataset;
        return data && extent && latest
          ? {
              alerts: data,
              extent: areas,
              latest: latestDate,
              settings: { latestDate },
            }
          : {};
      }))
    }

    // OTF HERE
    return null;
  },
  getDataURL: (params) => [
    fetchGladAlerts({ ...params, download: true }),
    getExtentGrouped({ ...params, download: true }),
  ],
  getWidgetProps,
};
