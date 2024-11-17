import { all, spread } from 'axios';
import { getLossNaturalForest } from 'services/analysis-cached';
import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_LOSS_DATASET,
  NATURAL_FOREST,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_LOSS,
  NATURAL_FOREST_2020,
} from 'data/layers';

import { EuropeFAOCountries } from 'utils/fao-countries';

import getWidgetProps from './selectors';

const MIN_YEAR = 2021;
const MAX_YEAR = 2023;

export default {
  widget: 'treeLossPlantations',
  title: 'Forest loss in natural forest in {location}',
  large: true,
  categories: ['forest-change'],
  subcategories: ['forest-loss'],
  types: ['country', 'aoi', 'wdpa'],
  admins: ['adm0', 'adm1', 'adm2'],
  alerts: [
    {
      text: 'Not all natural forest area can be monitored with existing data on tree cover loss. See the metadata for more information.',
      visible: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
    },
  ],
  settingsConfig: [
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true,
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
    // natural forest
    {
      dataset: NATURAL_FOREST,
      layers: [NATURAL_FOREST_2020],
      boundary: true,
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
    'From {startYear} to {endYear}, {percentage} of tree cover loss in {location} occurred within {lossPhrase}. The total loss within natural forest was {totalLoss} equivalent to {value} of CO\u2082e emissions.',
  whitelists: {
    indicators: ['plantations'],
    checkStatus: true,
    adm0: [
      'ZAF',
      'NZL',
      'IDN',
      'BRA',
      'URY',
      'PRY',
      'BOL',
      'PER',
      'COL',
      'ARG',
      'ECU',
      'VEN',
      'GUY',
      'SUR',
      'GUF',
    ],
  },
  blacklists: {
    adm0: EuropeFAOCountries,
  },
  settings: {
    threshold: 30,
    startYear: MIN_YEAR,
    endYear: MAX_YEAR,
    extentYear: 2010,
  },
  getData: (params) =>
    all([
      getLossNaturalForest({ ...params, forestType: 'plantations' }),
      getLossNaturalForest({ ...params, forestType: '' }),
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
    getLossNaturalForest({
      ...params,
      forestType: 'plantations',
      download: true,
    }),
    getLossNaturalForest({ ...params, forestType: '', download: true }),
  ],
  getWidgetProps,
};
