import axios from 'axios';

import { fetchGladIntersectionAlerts, fetchGLADLatest } from 'services/alerts';
import { getExtentGrouped } from 'services/forest-data';

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
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['%', 'ha']
    },
    {
      key: 'weeks',
      label: 'weeks',
      type: 'select',
      whitelist: [13, 26, 52],
      noSort: true
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch'
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  chartType: 'rankedList',
  metaKey: 'widget_deforestation_alert_location',
  colors: 'loss',
  datasets: [
    // GLAD
    {
      dataset: 'e663eb09-04de-4f39-b871-35c6c2ed10b5',
      layers: ['dd5df87f-39c2-4aeb-a462-3ef969b20b66']
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
  whitelists: {
    adm0: [
      'BRA',
      'COL',
      'ECU',
      'GUF',
      'GUY',
      'PER',
      'SUR',
      'BDI',
      'CMR',
      'CAF',
      'GNQ',
      'GAB',
      'RWA',
      'UGA',
      'IDN',
      'MYS',
      'PNG',
      'VEN',
      'TLS',
      'COD',
      'COG'
    ]
  },
  getData: params =>
    axios
      .all([
        fetchGladIntersectionAlerts(params),
        fetchGLADLatest(params),
        getExtentGrouped(params)
      ])
      .then(
        axios.spread((alerts, latest, extent) => {
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
  getWidgetProps
};
