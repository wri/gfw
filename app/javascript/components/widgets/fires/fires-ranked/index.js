import { all, spread } from 'axios';
import {
  fetchVIIRSAlertsGrouped,
  fetchVIIRSLatest,
  getAreaIntersectionGrouped
} from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  widget: 'firesRanked',
  title: {
    default: 'Regions with the most fire Alerts in {location}',
    global: 'Global regions with the most fire Alerts'
  },
  categories: ['fires'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1'],
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
      type: 'select',
      whitelist: ['counts', 'alert_density', 'significance']
    },
    {
      key: 'weeks',
      label: 'show data for the last',
      type: 'select',
      whitelist: [1, 2, 8, 4, 13, 26, 52],
      border: true,
      noSort: true
    },
    {
      key: 'confidence',
      label: 'Confidence level',
      type: 'select',
      clearable: false,
      options: [{ label: 'All', value: '' }, { label: 'High', value: 'h' }]
    }
  ],
  refetchKeys: ['dataset', 'forestType', 'landCategory', 'confidence', 'weeks'],
  chartType: 'rankedList',
  metaKey: 'widget_fire_ranking',
  colors: 'fires',
  sortOrder: {
    summary: 6,
    fires: 2,
    global: 100
  },
  sentences: {
    initial:
      'In the last {timeframe} in {location}, the region with the most <b>significant</b> number of fire alerts was {topRegion}, with {topRegionCount} fire alerts.  This represents {topRegionPerc} of all alerts detected in {location} and is {status} compared to the number of fires in the same period going back to <b>2012</b>.',
    withInd:
      'In the last {timeframe} in {location}, the region with the most <b>significant</b> number of fire alerts within {indicator} was {topRegion}, with {topRegionCount} fire alerts.  This represents {topRegionPerc} of all alerts detected in {location} and is {status} compared to the number of fires in the same period going back to <b>2012</b>.',
    densityInitial:
      'In the last {timeframe} in {location}, the region with the <b>highest density</b> of fires was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of all alerts detected in {location} in the same period.',
    densityWithInd:
      'In the last {timeframe} in {location}, the region with the <b>highest density</b> of fires within {indicator} was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of all alerts detected in {location} in the same period.',
    countsInitial:
      'In the last {timeframe} in {location}, the region with the <b>most</b> fire alerts was {topRegion}, with {topRegionCount} fire alerts. This represents {topRegionPerc} of all alerts detected in {location} in the same period.',
    countsWithInd:
      'In the last {timeframe} in {location}, the region with the <b>most</b> fire alerts within {indicator} was {topRegion}, with {topRegionCount} fire alerts. This represents {topRegionPerc} of all alerts detected in {location} in the same period.',
    initialGlobal:
      'In the last {timeframe}, the region with the most <b>significant</b> number of fire alerts <b>globally</b> was {topRegion}, with {topRegionCount} fire alerts.  This represents {topRegionPerc} of all alerts detected in {location} and is {status} compared to the number of fires in the same period going back to <b>2012</b>.',
    withIndGlobal:
      'In the last {timeframe}, the region with the most <b>significant</b> number of fire alerts within {indicator} <b>globally</b> was {topRegion}, with {topRegionCount} fire alerts.  This represents {topRegionPerc} of all alerts detected <b>globally</b> and is {status} compared to the number of fires in the same period going back to <b>2012</b>.',
    densityInitialGlobal:
      'In the last {timeframe}, the region with the <b>highest density</b> of fires <b>globally</b> was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of all alerts detected <b>globally</b> in the same period.',
    densityWithIndGlobal:
      'In the last {timeframe}, the region with the <b>highest density</b> of fires within {indicator} <b>globally</b> was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of all alerts detected <b>globally</b> in the same period.',
    countsInitialGlobal:
      'In the last {timeframe}, the region with the <b>most</b> fire alerts <b>globally</b> was {topRegion}, with {topRegionCount} fire alerts. This represents {topRegionPerc} of all alerts detected <b>globally</b> in the same period.',
    countsWithIndGlobal:
      'In the last {timeframe}, the region with the <b>most</b> fire alerts within {indicator} <b>globally</b> was {topRegion}, with {topRegionCount} fire alerts. This represents {topRegionPerc} of all alerts detected <b>globally</b> in the same periodd.'
  },
  settings: {
    unit: 'significance',
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
    fetchVIIRSLatest(params)
      .then(
        response =>
          (response.attributes && response.attributes.updatedAt) || null
      )
      .then(latest =>
        all([
          fetchVIIRSAlertsGrouped({ ...params, latest }),
          getAreaIntersectionGrouped(params)
        ])
          .then(
            spread((alerts, areas) => {
              const { data } = alerts.data;
              const area = areas.data && areas.data.data;
              return { alerts: data, latest, area } || {};
            })
          )
          .catch(error => {
            console.info(error);
            return null;
          })
      )
      .catch(error => {
        console.info(error);
        return null;
      }),
  // getDataURL: params => [
  //   fetchFiresAlertsGrouped({ ...params, download: true })
  // ],
  getWidgetProps
};
