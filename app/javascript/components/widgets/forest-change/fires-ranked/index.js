import { all, spread } from 'axios';
import { fetchFiresAlertsGrouped, fetchFiresLatest } from 'services/alerts';

import getWidgetProps from './selectors';

export default {
  widget: 'firesRanked',
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
  metaKey: 'widget_fire_ranking',
  colors: 'fires',
  sortOrder: {
    summary: 6,
    forestChange: 10
  },
  sentences: {
    initial:
      'In the last {timeframe} in {location}, the region with the most fires burning was {topRegion}, with {topRegionCount} fire alerts, representing {topRegionPerc} of total alerts detected.',
    withInd:
      'In the last {timeframe} in {location}, the region with the most fires burning within {indicator} was {topRegion}, with {topRegionCount} fire alerts, representing {topRegionPerc} of total alerts detected.'
  },
  settings: {
    unit: '%',
    pageSize: 5,
    page: 0,
    period: 'week',
    weeks: 13,
    dataset: 'viirs',
    layerStartDate: null,
    layerEndDate: null
  },
  getData: params =>
    all([fetchFiresAlertsGrouped(params), fetchFiresLatest(params)]).then(
      spread((alerts, latest) => {
        const { data } = alerts.data;
        return { alerts: data, latest: latest.attributes.updatedAt } || {};
      })
    ),
  // getDataURL: params => [
  //   fetchFiresAlertsGrouped({ ...params, download: true })
  // ],
  getWidgetProps
};
