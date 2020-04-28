import { all, spread } from 'axios';
import {
  fetchFiresCommoditiesAlerts,
  fetchFiresCommoditiesArea,
  fetchVIIRSLatest
} from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  widget: 'firesCommodities',
  title: 'Density of fires alerts in {location} commodities concessions',
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      whitelist: ['wdpa'],
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'weeks',
      label: 'weeks',
      type: 'select',
      whitelist: [13, 26, 52],
      noSort: true
    }
  ],
  chartType: 'rankedList',
  metaKey: '',
  colors: 'fires',
  sortOrder: {
    forestChange: -1
  },
  sentences: {
    initial:
      'In the last {timeframe}, the {location} commodities concessions with the highest fires alerts density was {highest_com}, with {density_val}.',
    withInd:
      'In the last {timeframe}, the {location} commodities concessions with the highest fires alerts density within {indicator} was {highest_com}, with {density_val}.'
  },
  settings: {
    unit: 'alerts/Ha',
    pageSize: 5,
    page: 0,
    period: 'week',
    weeks: 13,
    dataset: 'VIIRS',
    layerStartDate: null,
    layerEndDate: null
  },
  getData: params =>
    all([
      fetchFiresCommoditiesAlerts(params),
      fetchFiresCommoditiesArea(params),
      fetchVIIRSLatest(params)
    ]).then(
      spread((alerts, area, latest) => {
        const { data } = alerts.data;
        // console.log('data_alerts', data)
        // console.log('data_are',area.data)
        return (
          {
            alerts: data,
            area: area.data,
            latest: latest.attributes.updatedAt
          } || {}
        );
      })
    ),
  // getDataURL: params => [
  //   fetchFiresAlertsGrouped({ ...params, download: true })
  // ],
  getWidgetProps
};
