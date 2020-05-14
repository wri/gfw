import { all, spread } from 'axios';
import tropicalIsos from 'data/tropical-isos.json';

import {
  POLITICAL_BOUNDARIES_DATASET,
  GLAD_DEFORESTATION_ALERTS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  GLAD_ALERTS
} from 'data/layers';

import {
  getExtentGrouped,
  fetchGladAlerts,
  fetchGLADLatest
} from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  widget: 'gladRanked',
  title: 'Location of deforestation Alerts in {location}',
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
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
      whitelist: ['mining', 'wdpa', 'landmark'],
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'weeks',
      label: 'show data for the last',
      type: 'select',
      whitelist: [4, 13, 26, 52],
      noSort: true
    },
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['%', 'ha'],
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  pendingKeys: ['extentYear', 'threshold'],
  refetchKeys: ['forestType', 'landCategory', 'extentYear', 'threshold'],
  chartType: 'rankedList',
  metaKey: 'widget_deforestation_alert_location',
  colors: 'loss',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // GLAD
    {
      dataset: GLAD_DEFORESTATION_ALERTS_DATASET,
      layers: [GLAD_ALERTS]
    }
  ],
  sortOrder: {
    summary: 6,
    forestChange: 10
  },
  sentences: {
    initial:
      'In the last {timeframe} in {location}, {count} GLAD alerts were detected, which affected an area of approximately {area}. The top {topRegions} accounted for {topPercent} of all GLAD alerts.',
    withInd:
      'In the last {timeframe} in {location}, {count} GLAD alerts were detected within {indicator}, which affected an area of approximately {area}. The top {topRegions} accounted for {topPercent} of all GLAD alerts.'
  },
  settings: {
    threshold: 30,
    extentYear: 2010,
    unit: '%',
    weeks: 4,
    pageSize: 5,
    page: 0,
    ifl: 2016
  },
  whitelistType: 'glad',
  whitelists: {
    adm0: tropicalIsos
  },
  getData: params =>
    all([
      fetchGladAlerts({ ...params, grouped: true }),
      fetchGLADLatest(params),
      getExtentGrouped(params)
    ]).then(
      spread((alerts, latest, extent) => {
        const { data } = alerts.data;
        const areas = extent.data.data;
        const latestDate = latest.attributes && latest.attributes.updatedAt;

        return data && extent && latest
          ? {
            alerts: data,
            extent: areas,
            latest: latestDate,
            settings: { latestDate }
          }
          : {};
      })
    ),
  getDataURL: params => [
    fetchGladAlerts({ ...params, download: true }),
    getExtentGrouped({ ...params, download: true })
  ],
  getWidgetProps
};
