import {
  POLITICAL_BOUNDARIES_DATASET,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  TREE_COVER_LOSS_BY_DOMINANT_DRIVER,
} from 'data/layers';

import { getTreeCoverLossByDriverType } from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  widget: 'treeLossTsc',
  title: {
    initial: 'Tree cover loss by dominant driver in {location}',
    global: 'Global tree cover loss by dominant driver',
  },
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  // alerts: {
  //   default: [
  //     {
  //       id: 'tree-loss-drivers-alert-1',
  //       text: `The methods behind this data have changed over time. Be cautious comparing old and new, data especially before/after 2015. [Read more here](https://www.globalforestwatch.org/blog/data-and-research/tree-cover-loss-satellite-data-trend-analysis/).`,
  //       icon: 'warning',
  //       visible: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
  //     },
  //   ],
  //   indonesia: [
  //     {
  //       id: 'tree-loss-drivers-indonesia-alert-1',
  //       text: `Indonesia’s rates of deforestation have slowed significantly in recent years (2016-2021), largely due to reductions in commodity-driven expansion. Much of the primary forest loss from commodity-driven deforestation in Indonesia according to the GFW data actually took place in areas legally classified as secondary forests, not primary forests. Please note that ground verification is recommended before any hard conclusions are drawn about the type of forest affected, or cause of loss, in specific patches of loss on the GFW map.`,
  //       icon: 'warning',
  //       visible: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
  //       areaWhitelist: ['IDN'],
  //     },
  //   ],
  // },
  categories: ['summary', 'forest-change'],
  subcategories: ['forest-loss'],
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
    startYear: 2001,
    endYear: 2021,
    chartHeight: 230,
    extentYear: 2000,
  },
  sentences: {
    globalInitial:
      '<b>Globally</b> from {startYear} to {endYear}, {lossPercentage} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
    initial:
      'In {location} from {startYear} to {endYear}, {lossPercentage} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
  },
  whitelists: {
    checkStatus: true,
  },
  getChartSettings: (params) => {
    const { dashboard, embed } = params;

    return {
      ...((dashboard || embed) && {
        groupedLegends: true,
        size: 'small',
        legend: {
          style: {
            display: 'flex',
            justifyContent: 'center',
            paddingLeft: '8%',
          },
        },
        chart: {
          style: {
            display: 'flex',
            height: 'auto',
            alignItems: 'center',
            paddingRight: '14%',
          },
        },
      }),
    };
  },
  getData: (params) =>
    getTreeCoverLossByDriverType(params).then((response) => {
      const { data } = (response && response.data) || {};
      return data;
    }),
  getDataURL: (params) => [
    getTreeCoverLossByDriverType({ ...params, download: true }),
  ],
  getWidgetProps,
};
