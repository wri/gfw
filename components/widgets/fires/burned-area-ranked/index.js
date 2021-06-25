import { all, spread } from 'axios';
import {
  fetchBurnedAreaGrouped,
  fetchVIIRSLatest,
  getAreaIntersectionGrouped,
} from 'services/analysis-cached';
import firesRanked from 'components/widgets/fires/fires-ranked';

import {
  POLITICAL_BOUNDARIES_DATASET,
  BURNED_AREA_MODIS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  BURNED_AREA_MODIS,
} from 'data/layers';

import getWidgetProps from './selectors';

const defaultConfig = {
  widget: 'burnedAreaRanked',
  title: {
    default: 'Regions with the most burned area in {location}',
    global: 'Global regions with the most burned area',
  },
  categories: ['fires'],
  large: true,
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All land cover',
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
      key: 'dataset',
      label: 'fires dataset',
      type: 'select',
    },
    {
      key: 'unit',
      label: 'unit',
      type: 'select',
      whitelist: ['total_burn', 'burn_proportion', 'significance'],
    },
    {
      key: 'weeks',
      label: 'show data for the last',
      type: 'select',
      whitelist: [4, 13, 26, 52],
      border: true,
      noSort: true,
    },
  ],
  chartType: 'lollipop',
  colors: 'fires',
  sortOrder: {
    summary: 6,
    fires: 3,
    global: 100,
  },
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // fires
    {
      dataset: BURNED_AREA_MODIS_DATASET,
      layers: [BURNED_AREA_MODIS],
    },
  ],
  refetchKeys: ['dataset', 'forestType', 'landCategory', 'weeks'],
  metaKey: '',
  sentences: {
    initial:
      'In the last {timeframe} in {location}, the region with the most {significant} burned area was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned in {location} and is {status} compared to the same period going back to <b>2001</b>.',
    withInd:
      'In the last {timeframe} in {location}, the region with the most {significant} burned area within {indicator} was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned in {location} and is {status} compared to the same period going back to <b>2001</b>.',
    densityInitial:
      'In the last {timeframe} in {location}, the region with the <b>highest proportion</b> of land area burned was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of the total area burned in {location} in the same period.',
    densityWithInd:
      'In the last {timeframe} in {location}, the region with the <b>highest proportion</b> of land area burned within {indicator} was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of the total area burned in {location} in the same period.',
    countsInitial:
      'In the last {timeframe} in {location}, the region with the <b>most</b> burned area was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} in the same period.',
    countsWithInd:
      'In the last {timeframe} in {location}, the region with the <b>most</b> burned area within {indicator} was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} in the same period.',
    initialGlobal:
      'In the last {timeframe}, the country with the most {significant} burned area <b>globally</b> was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} and is {status} compared to the same period going back to <b>2001</b>.',
    withIndGlobal:
      'In the last {timeframe}, the country with the most {significant} burned area within {indicator} <b>globally</b> was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} and is {status} compared to the same period going back to <b>2001</b>.',
    densityInitialGlobal:
      'In the last {timeframe}, the country with the <b>highest proportion</b> of land area burned <b>globally</b> was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of the total area burned {location} in the same period.',
    densityWithIndGlobal:
      'In the last {timeframe}, the country with the <b>highest proportion</b> of land area burned within {indicator} <b>globally</b> was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of the total area burned {location} in the same period.',
    countsInitialGlobal:
      'In the last {timeframe}, the country with the <b>most</b> burned area <b>globally</b> was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} in the same period.',
    countsWithIndGlobal:
      'In the last {timeframe}, the country with the <b>most</b> burned area within {indicator} <b>globally</b> was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} in the same periodd.',
  },
  settings: {
    unit: 'significance',
    pageSize: 5,
    page: 0,
    period: 'week',
    weeks: 4,
    dataset: 'modis_burned_area',
    layerStartDate: null,
    layerEndDate: null,
  },
  getData: (params) =>
    fetchVIIRSLatest(params)
      .then((response) => (response && response.date) || null)
      .then((latest) =>
        all([
          fetchBurnedAreaGrouped({ ...params, latest }),
          getAreaIntersectionGrouped(params),
        ])
          .then(
            spread((alerts, areas) => {
              const { data } = alerts.data;
              const area = areas.data && areas.data.data;
              return { alerts: data, latest, area } || {};
            })
          )
          .catch(() => {
            return null;
          })
      )
      .catch(() => {
        return null;
      }),
  getDataURL: async (params) => {
    const latestResponse = await fetchVIIRSLatest(params);
    const latest = (latestResponse && latestResponse.date) || null;

    return [
      fetchBurnedAreaGrouped({ ...params, latest, download: true }),
      getAreaIntersectionGrouped({ ...params, download: true }),
    ];
  },
  getWidgetProps,
};

export default {
  widget: 'firesRanked',
  proxy: true,
  refetchKeys: ['dataset'],
  getWidget: (widgetSettings) => {
    // called when settings changes
    if (!widgetSettings || !widgetSettings.dataset) {
      return defaultConfig;
    }
    if (widgetSettings.dataset === 'modis_burned_area') {
      return firesRanked;
    }
    return defaultConfig;
  },
};
