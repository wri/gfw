import {
  POLITICAL_BOUNDARIES_DATASET,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER,
} from 'data/layers';

import treeLoss from 'components/widgets/forest-change/tree-loss';
import { getLoss } from 'services/analysis-cached';

import getWidgetProps from './selectors';

const MIN_YEAR = 2001;
const MAX_YEAR = 2025;

export default {
  ...treeLoss,
  widget: 'treeLossTsc',
  title: {
    initial: 'Tree cover loss by dominant driver in {location}',
    global: 'Global tree cover loss by dominant driver',
  },
  types: ['global', 'country', 'use', 'wdpa', 'aoi', 'geostore'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  large: true,
  visible: ['dashboard', 'analysis'],
  colors: 'loss',
  pendingKeys: ['threshold'],
  refetchKeys: ['threshold'],
  dataType: 'loss',
  settingsConfig: [
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  chartType: 'pieChart',
  alerts: [],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
      layers: [TREE_COVER_LOSS_BY_DOMINANT_DRIVER],
    },
  ],
  metaKey: 'widget_tsc_drivers',
  sortOrder: {
    summary: 1,
    forestChange: 1,
    global: 1,
  },
  settings: {
    threshold: 30,
    startYear: MIN_YEAR,
    endYear: MAX_YEAR,
    chartHeight: 230,
    extentYear: 2000,
  },
  sentences: {
    globalInitial:
      '<b>Globally</b> from {startYear} to {endYear}, {lossPercentage} of tree cover loss occurred in areas where the dominant drivers of loss resulted in deforestation.',
    initial:
      'In {location} from {startYear} to {endYear}, {lossPercentage} of tree cover loss occurred in areas where the dominant drivers of loss resulted in deforestation.',
  },
  whitelists: {
    checkStatus: true,
  },
  getChartSettings: (params) => {
    const { dashboard, embed } = params;

    return {
      ...((dashboard || embed) && {
        size: 'small',
        chart: {
          style: {
            display: 'flex',
            height: 'auto',
            alignItems: 'center',
          },
        },
      }),
      groupedLegends: true,
    };
  },
  getData: async (params) => {
    const response = await getLoss({
      ...params,
      landCategory: 'tsc',
      lossTsc: true,
    });

    let data = [];

    if (response && response.data) {
      const groupedLoss = response.data.data.reduce((acc, item) => {
        const driver =
          item.wri_google_tree_cover_loss_drivers__driver || item.driver_type;

        if (!driver || driver === 'Unknown') {
          return acc;
        }

        const lossArea = Number(item.umd_tree_cover_loss__ha || 0);

        if (!acc[driver]) {
          acc[driver] = {
            driver_type: driver,
            loss_area_ha: 0,
          };
        }

        acc[driver].loss_area_ha += lossArea;

        return acc;
      }, {});

      data = Object.values(groupedLoss);
    }

    return data;
  },
  getDataURL: (params) => [
    getLoss({
      ...params,
      landCategory: 'tsc',
      lossTsc: true,
      download: true,
    }),
  ],
  getWidgetProps,
};
