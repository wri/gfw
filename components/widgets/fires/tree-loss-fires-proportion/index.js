import { getLossFires, getLossFiresOTF } from 'services/analysis-cached';

import { getYearsRangeFromData } from 'components/widgets/utils/data';

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

const MAX_YEAR = 2023;
const MIN_YEAR = 2001;

const getGlobalLocation = (params) => ({
  adm0: params.type === 'global' ? null : params.adm0,
  adm1: params.type === 'global' ? null : params.adm1,
  adm2: params.type === 'global' ? null : params.adm2,
});

export default {
  widget: 'treeLossFiresProportion',
  title: {
    default: 'Proportion of tree cover loss due to fires in {location}',
    global: 'Global proportion of tree cover loss due to fires',
  },
  categories: ['fires'],
  types: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  large: false,
  visible: ['dashboard', 'analysis'],
  chartType: 'pieChart',
  colors: 'lossFires',
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
      blacklist: ['mangroves_2016'],
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
  dataType: 'loss',
  metaKey: 'umd_tree_cover_loss_from_fires',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // loss
    {
      dataset: FOREST_LOSS_FIRES_DATASET,
      layers: [FOREST_LOSS_FIRES],
    },
  ],
  sortOrder: {
    summary: 102,
    fires: 10,
  },
  sentence: {
    globalInitial:
      'Fires were responsible for {lossFiresPercentage} of tree cover loss globally between {startYear} and {endYear}.',
    globalWithIndicator:
      'Fires were responsible for {lossFiresPercentage} of tree cover loss globally in {indicator} between {startYear} and {endYear}.',
    initial:
      'Fires were responsible for {lossFiresPercentage} of tree cover loss in {location} between {startYear} and {endYear}.',
    withIndicator:
      'Fires were responsible for {lossFiresPercentage} of tree cover loss in {location} in {indicator} between {startYear} and {endYear}.',
    noLoss:
      'Fires were responsible for {lossFiresPercentage} of tree cover loss in {location} between {startYear} and {endYear}.',
    noLossWithIndicator:
      'Fires were responsible for {lossFiresPercentage} of tree cover loss in {location} in {indicator} between {startYear} and {endYear}.',
  },
  settings: {
    threshold: 30,
    ifl: 2000,
    startYear: MIN_YEAR,
    endYear: MAX_YEAR,
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
      lossFetch = getLossFires({ ...params, ...globalLocation });
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

      const { startYear, endYear, range } =
        (data.loss && getYearsRangeFromData(data.loss)) || {};

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
    return [getLossFires({ ...params, ...globalLocation, download: true })];
  },
  getWidgetProps,
};
