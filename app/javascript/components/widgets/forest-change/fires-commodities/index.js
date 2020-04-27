import { all, spread } from 'axios';
import {
  fetchFiresCommoditiesAlerts,
  fetchVIIRSLatest
} from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  widget: 'firesCommodities',
  title: 'Regions with the most fire Alerts in {location}',
  categories: ['forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  settingsConfig: [
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
    initial: 'In the last {timeframe} in {location}, this is a test.'
  },
  settings: {
    unit: '%',
    pageSize: 5,
    page: 0,
    period: 'week',
    weeks: 13,
    dataset: 'VIIRS',
    layerStartDate: null,
    layerEndDate: null
  },
  getData: params =>
    all([fetchFiresCommoditiesAlerts(params), fetchVIIRSLatest(params)]).then(
      spread((alerts, latest) => {
        const { data } = alerts.data;
        console.log('data', data)
        return { alerts: data, latest: latest.attributes.updatedAt } || {};
      })
    ),
  // getDataURL: params => [
  //   fetchFiresAlertsGrouped({ ...params, download: true })
  // ],
  getWidgetProps
};
