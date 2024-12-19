import { all, spread } from 'axios';
import { getLoss } from 'services/analysis-cached';
import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_LOSS_DATASET,
  TREE_PLANTATIONS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_LOSS,
  TREE_PLANTATIONS,
} from 'data/layers';

import getWidgetProps from './selectors';

const MIN_YEAR = 2013;
const MAX_YEAR = 2023;

export default {
  widget: 'treeLossPlantations',
  title: 'Forest loss in natural forest in {location}',
  large: true,
  categories: ['forest-change'],
  subcategories: ['forest-loss'],
  types: ['country', 'aoi', 'wdpa'],
  admins: ['adm0', 'adm1', 'adm2'],
  settingsConfig: [
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
  refetchKeys: ['threshold'],
  chartType: 'composedChart',
  colors: 'loss',
  metaKey: 'widget_plantations_tree_cover_loss',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      // global plantations
      dataset: TREE_PLANTATIONS_DATASET,
      layers: [TREE_PLANTATIONS],
    },
    // loss
    {
      dataset: FOREST_LOSS_DATASET,
      layers: [FOREST_LOSS],
    },
  ],
  sortOrder: {
    forestChange: 2,
  },
  sentence:
    'From {startYear} to {endYear}, {percentage} of tree cover loss in {location} occurred within {lossPhrase}. The total loss within natural forest was equivalent to {value} of CO\u2082e emissions.',
  whitelists: {
    indicators: ['plantations'],
    checkStatus: true,
  },
  settings: {
    threshold: 30,
    startYear: MIN_YEAR,
    endYear: MAX_YEAR,
    extentYear: 2010,
  },
  getData: (params) =>
    all([
      getLoss({ ...params, forestType: 'plantations' }),
      getLoss({ ...params, forestType: '' }),
    ]).then(
      spread((plantationsloss, gadmLoss) => {
        let data = {};
        const lossPlantations =
          plantationsloss.data && plantationsloss.data.data;
        const totalLoss = gadmLoss.data && gadmLoss.data.data;
        if (
          lossPlantations &&
          totalLoss &&
          lossPlantations.length &&
          totalLoss.length
        ) {
          data = {
            lossPlantations,
            totalLoss,
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
    getLoss({ ...params, forestType: 'plantations', download: true }),
    getLoss({ ...params, forestType: '', download: true }),
  ],
  getWidgetProps,
};
