import { all, spread } from 'axios';
import {
  fetchBurnedAreaGrouped,
  fetchMODISLatest,
  getAreaIntersectionGrouped,
} from 'services/analysis-cached';
import firesRanked from 'components/widgets/fires/fires-ranked';

import getWidgetProps from './selectors';

const defaultConfig = {
  widget: 'burnedAreaRanked',
  title: {
    default: 'Regions with the most burned area in {location}',
    global: 'Global regions with the most burned area',
  },
  categories: ['fires'],
  dataType: 'fires',
  large: true,
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1'],
  alerts: [
    {
      id: 'regions-most-burned-areas-1',
      text: 'We are preparing to remove MODIS Burned Areas from the Global Forest Watch site and will not be updating the data going forward. Please e-mail gfw@wri.org with any requests to keep this dataset or with suggestions for new fire-related data sets.',
      visible: ['global', 'country', 'adm0', 'adm1', 'dashboard'],
    },
  ],
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
    {
      key: 'firesThreshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
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
  refetchKeys: [
    'dataset',
    'forestType',
    'landCategory',
    'weeks',
    'firesThreshold',
  ],
  metaKey: 'umd_modis_burned_areas',
  sentences: {
    initial:
      'In the most recent {timeframe} of data in {location}, the region with the most {significant} burned area was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned in {location} and is {status} compared to the same period going back to <b>2001</b>',
    withInd:
      'In the most recent {timeframe} of data in {location}, the region with the most {significant} burned area within {indicator} was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned in {location} and is {status} compared to the same period going back to <b>2001</b>',
    densityInitial:
      'In the most recent {timeframe} of data in {location}, the region with the <b>highest proportion</b> of land area burned was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of the total area burned in {location} in the same period',
    densityWithInd:
      'In the most recent {timeframe} of data in {location}, the region with the <b>highest proportion</b> of land area burned within {indicator} was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of the total area burned in {location} in the same period',
    countsInitial:
      'In the most recent {timeframe} of data in {location}, the region with the <b>most</b> burned area was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} in the same period',
    countsWithInd:
      'In the most recent {timeframe} of data in {location}, the region with the <b>most</b> burned area within {indicator} was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} in the same period',
    initialGlobal:
      'In the most recent {timeframe} of data, the country with the most {significant} burned area <b>globally</b> was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} and is {status} compared to the same period going back to <b>2001</b>',
    withIndGlobal:
      'In the most recent {timeframe} of data, the country with the most {significant} burned area within {indicator} <b>globally</b> was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} and is {status} compared to the same period going back to <b>2001</b>',
    densityInitialGlobal:
      'In the most recent {timeframe} of data, the country with the <b>highest proportion</b> of land area burned <b>globally</b> was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of the total area burned {location} in the same period',
    densityWithIndGlobal:
      'In the most recent {timeframe} of data, the country with the <b>highest proportion</b> of land area burned within {indicator} <b>globally</b> was {topRegion}, with {topRegionDensity}. This represents {topRegionPerc} of the total area burned {location} in the same period',
    countsInitialGlobal:
      'In the most recent {timeframe} of data, the country with the <b>most</b> burned area <b>globally</b> was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} in the same period',
    countsWithIndGlobal:
      'In the most recent {timeframe} of data, the country with the <b>most</b> burned area within {indicator} <b>globally</b> was {topRegion}, with {topRegionCount} land area burned. This represents {topRegionPerc} of the total area burned {location} in the same period',
    thresholdStatement:
      ', considering land with {thresh} tree canopy or greater.',
  },
  settings: {
    unit: 'significance',
    pageSize: 5,
    page: 0,
    period: 'week',
    weeks: 4,
    dataset: 'modis',
    layerStartDate: null,
    layerEndDate: null,
    firesThreshold: 0,
  },
  getData: (params) =>
    fetchMODISLatest(params)
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
    const latestResponse = await fetchMODISLatest(params);
    const latest = (latestResponse && latestResponse.date) || null;

    return [
      fetchBurnedAreaGrouped({ ...params, latest, download: true }),
      getAreaIntersectionGrouped({ ...params, download: true }),
    ];
  },
  getWidgetProps,
};

export default {
  widget: 'burnedAreaRanked',
  proxy: true,
  refetchKeys: ['dataset'],
  getWidget: (widgetSettings) => {
    // called when settings changes
    if (widgetSettings?.dataset !== 'modis_burned_area') {
      return firesRanked;
    }

    return defaultConfig;
  },
};
