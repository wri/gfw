import { all, spread } from 'axios';
import uniq from 'lodash/uniq';
import moment from 'moment';
import { fetchBurnedArea, fetchMODISLatest } from 'services/analysis-cached';
import firesAlertsCumulative from 'components/widgets/fires/fires-alerts-cumulative';

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
  widget: 'burnedAreaCumulative',
  title: 'Cumulative Burned Area in {location}',
  large: true,
  dataType: 'fires',
  categories: ['summary', 'fires'],
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
      key: 'compareYear',
      label: 'Compare with the same period in',
      placeholder: 'None',
      type: 'compare-select',
      clearable: true,
      border: true,
    },
    {
      key: 'firesThreshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
      noSort: true,
    },
  ],
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
  refetchKeys: [
    'dataset',
    'forestType',
    'landCategory',
    'confidence',
    'firesThreshold',
  ],
  preventRenderKeys: ['startIndex', 'endIndex'],
  visible: ['dashboard', 'analysis'],
  types: ['country', 'wdpa', 'aoi'],
  admins: ['adm0', 'adm1', 'adm2'],
  chartType: 'composedChart',
  hideLayers: true,
  colors: 'fires',
  metaKey: 'umd_modis_burned_areas',
  sortOrder: {
    summary: 100,
    fires: 2,
  },
  settings: {
    dataset: 'modis_burned_area',
    firesThreshold: 0,
  },
  sentences: {
    allBurn:
      'In {location}, {area} of land has burned so far in {latestYear}. This total is {status} compared to the total for previous years going back to {dataset_start_year}. The most fires recorded in a year was {maxYear}, with {maxArea}',
    allBurnWithInd:
      'In {location}, {area} of land within {indicator} has burned so far in {latestYear}. This total is {status} compared to the total for previous years going back to {dataset_start_year}. The most fires recorded in a year was {maxYear}, with {maxArea}',
    thresholdStatement:
      ', considering land with {thresh} tree canopy or greater.',
  },
  getData: (params) =>
    all([fetchBurnedArea(params), fetchMODISLatest(params)]).then(
      spread((alerts, latest) => {
        const { data } = alerts.data;
        const years = uniq(data.map((d) => d.year));
        const maxYear = Math.max(...years);
        const latestDate = latest && latest.date;
        const allYears = years.filter((y) => y !== maxYear);

        return (
          {
            alerts: data,
            latest: latestDate,
            options: {
              compareYear: [
                { label: 'All', value: 'all' },
                ...allYears.map((y) => ({
                  label: y,
                  value: y,
                })),
              ],
            },
            settings: {
              startDateAbsolute: moment(latestDate)
                .add(-3, 'month')
                .format('YYYY-MM-DD'),
              endDateAbsolute: latestDate,
            },
          } || {}
        );
      })
    ),
  getDataURL: (params) => [fetchBurnedArea({ ...params, download: true })],
  getWidgetProps,
};

export default {
  widget: 'burnedAreaCumulative',
  proxy: true,
  refetchKeys: ['dataset'],
  getWidget: (widgetSettings) => {
    // called when settings changes
    if (!widgetSettings || !widgetSettings.dataset) {
      return defaultConfig;
    }
    if (widgetSettings.dataset !== 'modis_burned_area') {
      return firesAlertsCumulative;
    }
    return defaultConfig;
  },
};
