import { all, spread } from 'axios';
import {
  fetchVIIRSAlertsGrouped,
  fetchVIIRSLatest,
  getAreaIntersectionGrouped
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
      key: 'unit',
      label: 'unit',
      type: 'select',
      whitelist: ['counts', 'alert_density', 'anomaly'],
      border: true
    }
  ],
  refetchKeys: ['dataset', 'forestType', 'landCategory', 'confidence', 'weeks'],
  chartType: 'rankedList',
  metaKey: 'widget_fire_ranking',
  colors: 'fires',
  sortOrder: {
    summary: 6,
    forestChange: 10
  },
  sentences: {
    initial:
      'In the last {timeframe} in {location}, the region with the most <b>unusually high</b> number of fire alerts was {topRegion}, with {topRegionCount} fire alerts.  This represents {topRegionPerc} of all alerts detected in {location} and is {status} compared to the number of fires in the same period going back to <b>2012</b>.',
    withInd:
      'In the last {timeframe} in {location}, the region with the most <b>unusually high</b> number of fire alerts within {indicator} was {topRegion}, with {topRegionCount} fire alerts.  This represents {topRegionPerc} of all alerts detected in {location} and is {status} compared to the number of fires in the same period going back to <b>2012</b>.',
    densityInitial:
      'In the last {timeframe} in {location}, the region with the <b>highest density</b> of fires was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of all alerts detected in {location} in that period.',
    densityWithInd:
      'In the last {timeframe} in {location}, the region with the <b>highest density</b> of fires within {indicator} was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of all alerts detected in {location} in that period.',
    countsInitial:
      'In the last {timeframe} in {location}, the region with the <b>most</b> fire alerts was {topRegion}, with {topRegionCount} fire alerts. This represents {topRegionPerc} of all alerts detected in {location} in that period.',
    countsWithInd:
      'In the last {timeframe} in {location}, the region with the <b>most</b> fire alerts within {indicator} was {topRegion}, with {topRegionCount} fire alerts. This represents {topRegionPerc} of all alerts detecte in that periodd.'
  },
  settings: {
    unit: 'anomaly',
    confidence: 'h',
    pageSize: 5,
    page: 0,
    period: 'week',
    weeks: 4,
    dataset: 'viirs',
    layerStartDate: null,
    layerEndDate: null
  },
  getData: params =>
    all([
      fetchVIIRSAlertsGrouped(params),
      fetchVIIRSLatest(params),
      getAreaIntersectionGrouped(params)
    ]).then(
      spread((alerts, latest, areas) => {
        const { data } = alerts.data;
        const area = areas.data && areas.data.data;
        return (
          { alerts: data, latest: latest.attributes.updatedAt, area } || {}
        );
      })
    ),
  // getDataURL: params => [
  //   fetchFiresAlertsGrouped({ ...params, download: true })
  // ],
  getWidgetProps
};
