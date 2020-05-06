import { all, spread } from 'axios';
import {
  fetchVIIRSAlertsGrouped,
  fetchVIIRSLatest
} from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  widget: 'firesRanked',
  title: 'Regions with the most fire Alerts in {location}',
  categories: ['forest-change'],
  types: ['global', 'country'],
  admins: ['adm0', 'adm1'],
  settingsConfig: [
    {
      key: 'weeks',
      label: 'weeks',
      type: 'select',
      whitelist: [1, 4, 52],
      noSort: true
    },
    {
      key: 'confidence',
      label: 'Confidence level',
      type: 'select',
      clearable: false,
      border: true
    },
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
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'select',
      placeholder: 'Unit'
    }
  ],
  refetchKeys: ['dataset', 'forestType', 'landCategory', 'confidence'],
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
    confidence: 'h',
    pageSize: 5,
    page: 0,
    period: 'week',
    weeks: 13,
    dataset: 'viirs',
    layerStartDate: null,
    layerEndDate: null
  },
  getData: params =>
    all([fetchVIIRSAlertsGrouped(params), fetchVIIRSLatest(params)]).then(
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
