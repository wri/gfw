import {
  getLossFires,
  getLossFiresGrouped,
  getLossFiresOTF,
} from 'services/analysis-cached';

import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';
import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_LOSS_FIRES_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_LOSS_FIRES,
} from 'data/layers';

import getWidgetProps from './selectors';

const MAX_YEAR = 2021;
const MIN_YEAR = 2001;

const getGlobalLocation = (params) => ({
  adm0: params.type === 'global' ? null : params.adm0,
  adm1: params.type === 'global' ? null : params.adm1,
  adm2: params.type === 'global' ? null : params.adm2,
});

export default {
  widget: 'treeLossFiresAnnual',
  title: {
    default: 'Tree cover loss due to fires in {location}',
    global: 'Global annual tree cover loss from fires',
  },
  categories: ['summary', 'fires'],
  types: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  large: true,
  visible: ['dashboard', 'analysis'],
  chartType: 'composedChart',
  colors: 'lossFires',
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All tree cover',
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
  pendingKeys: ['threshold', 'years'],
  refetchKeys: ['forestType', 'landCategory', 'threshold', 'ifl'],
  dataType: 'lossFires',
  metaKey: 'umd_tree_cover_loss_from_fires',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: FOREST_LOSS_FIRES_DATASET,
      layers: [FOREST_LOSS_FIRES],
    },
  ],
  sortOrder: {
    summary: 102,
    fires: 2,
  },
  sentence: {
    globalInitial:
      'From {startYear} to {endYear}, there was a total of {treeCoverLossFires} <b>tree cover lost from fires globally</b> and {treeCoverLossNotFires} from all other drivers of loss. The year with the most tree cover loss due to fires during this period was {highestYearFires} with {highestYearFiresLossFires} lost to fires — {highestYearFiresPercentageLossFires} of all tree cover loss for that year.',
    globalWithIndicator:
      'From {startYear} to {endYear}, there was a total of {treeCoverLossFires} <b>tree cover lost from fires globally</b> within {indicator} and {treeCoverLossNotFires} from all other drivers of loss. The year with the most tree cover loss due to fires during this period was {highestYearFires} with {highestYearFiresLossFires} lost to fires — {highestYearFiresPercentageLossFires} of all tree cover loss for that year.',
    initial:
      'From {startYear} to {endYear}, {location} lost {treeCoverLossFires} of tree cover from fires and {treeCoverLossNotFires} from all other drivers of loss. The year with the most tree cover loss due to fires during this period was {highestYearFires} with {highestYearFiresLossFires} lost to fires — {highestYearFiresPercentageLossFires} of all tree cover loss for that year.',
    withIndicator:
      'From {startYear} to {endYear} in {indicator}, {location} lost {treeCoverLossFires} of tree cover from fires and {treeCoverLossNotFires} from all other drivers of loss. The year with the most tree cover loss due to fires during this period was {highestYearFires} with {highestYearFiresLossFires} lost to fires — {highestYearFiresPercentageLossFires} of all tree cover loss for that year.',
    noLoss:
      'From {startYear} to {endYear}, {location} lost {treeCoverLossFires} of tree cover due to fires.',
    noLossWithIndicator:
      'From {startYear} to {endYear} in {indicator}, {location} lost {treeCoverLossFires} of tree cover due to fires.',
  },
  settings: {
    threshold: 30,
    ifl: 2000,
  },
  getData: (params = {}) => {
    const { adm0, adm1, adm2, type } = params || {};

    const globalLocation = {
      adm0: type === 'global' ? null : adm0,
      adm1: type === 'global' ? null : adm1,
      adm2: type === 'global' ? null : adm2,
    };

    let lossFetch;
    if (shouldQueryPrecomputedTables(params)) {
      lossFetch =
        type === 'global'
          ? getLossFiresGrouped({ ...params, ...globalLocation })
          : getLossFires({ ...params, ...globalLocation });
    } else {
      lossFetch = getLossFiresOTF({ ...params, ...globalLocation });
    }

    return lossFetch.then((loss) => {
      let data = {};
      if (loss && loss.data) {
        data = {
          loss: loss.data.data,
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
    });
  },
  getDataURL: (params) => {
    const globalLocation = getGlobalLocation(params);
    return [
      params.type === 'global'
        ? getLossFiresGrouped({ ...params, ...globalLocation, download: true })
        : getLossFires({ ...params, ...globalLocation, download: true }),
    ];
  },
  getWidgetProps,
};
