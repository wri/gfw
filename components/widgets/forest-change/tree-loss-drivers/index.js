import { all, spread } from 'axios';
import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';

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
import { getExtent, getLoss } from 'services/analysis-cached';

import getWidgetProps from './selectors';

const MIN_YEAR = 2001;
const MAX_YEAR = 2023;

export default {
  ...treeLoss,
  widget: 'treeLossTsc',
  title: {
    initial: 'Annual tree cover loss by dominant driver in {location}',
    global: 'Global annual tree cover loss by dominant driver',
  },
  types: ['global', 'country'],
  admins: ['global', 'adm0'],
  alerts: {
    default: [
      {
        id: 'tree-loss-drivers-alert-1',
        text: `The methods behind this data have changed over time. Be cautious comparing old and new, data especially before/after 2015. [Read more here](https://www.globalforestwatch.org/blog/data-and-research/tree-cover-loss-satellite-data-trend-analysis/).`,
        icon: 'warning',
        visible: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
      },
    ],
    indonesia: [
      {
        id: 'tree-loss-drivers-indonesia-alert-1',
        text: `Indonesia’s rates of deforestation have slowed significantly in recent years (2016-2021), largely due to reductions in commodity-driven expansion. Much of the primary forest loss from commodity-driven deforestation in Indonesia according to the GFW data actually took place in areas legally classified as secondary forests, not primary forests. Please note that ground verification is recommended before any hard conclusions are drawn about the type of forest affected, or cause of loss, in specific patches of loss on the GFW map.`,
        icon: 'warning',
        visible: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
        areaWhitelist: ['IDN'],
      },
    ],
  },
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['plantations'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
    },
    {
      key: 'tscDriverGroup',
      label: 'drivers',
      type: 'select',
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  chartType: 'composedChart',
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
    // loss tsc
    {
      dataset: TREE_COVER_LOSS_BY_DOMINANT_DRIVER_DATASET,
      layers: [TREE_COVER_LOSS_BY_DOMINANT_DRIVER],
    },
  ],
  metaKey: 'tsc_tree_cover_loss_drivers_v2023',
  sortOrder: {
    summary: 1,
    forestChange: 1,
    global: 1,
  },
  settings: {
    tscDriverGroup: 'all',
    highlighted: false,
    extentYear: 2000,
    threshold: 30,
  },
  sentences: {
    initial:
      'In {location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
    initialWithIndicator:
      'In {location} from {startYear} to {endYear}, {permPercent} of tree cover loss in {indicator} occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
    noLoss:
      'In {location} from {startYear} to {endYear}, <b>no</b> tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
    globalInitial:
      '{location} from {startYear} to {endYear}, {permPercent} of tree cover loss occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
    globalWithIndicator:
      '{location} from {startYear} to {endYear}, {permPercent} of tree cover loss in {indicator} occurred in areas where the dominant drivers of loss resulted in {deforestation}.',
  },
  whitelists: {
    checkStatus: true,
  },
  getData: (params) =>
    all([
      getLoss({ ...params, landCategory: 'tsc', lossTsc: true }),
      getExtent({ ...params }),
    ]).then(
      spread((loss, extent) => {
        let data = {};
        if (loss && loss.data && extent && extent.data) {
          data = {
            loss: loss.data.data.filter(
              (d) => d.tsc_tree_cover_loss_drivers__driver !== 'Unknown'
            ),
            extent: (loss.data.data && extent.data.data[0].value) || 0,
          };
        }

        const { startYear, endYear, range } = getYearsRangeFromMinMax(
          MIN_YEAR,
          MAX_YEAR
        );

        return {
          ...data,
          settings: {
            startYear,
            endYear,
            yearsRange: range,
          },
          options: {
            years: range,
          },
        };
      })
    ),
  getDataURL: (params) => [
    getLoss({
      ...params,
      landCategory: 'tsc',
      lossTsc: true,
      download: true,
    }),
    getExtent({ ...params, download: true }),
  ],
  getWidgetProps,
};
