import { getLossFiresGrouped } from 'services/analysis-cached';
import groupBy from 'lodash/groupBy';

import { getYearsRangeFromData } from 'components/widgets/utils/data';

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

export default {
  widget: 'treeLossFires',
  title: {
    default: 'Regions with most tree cover loss due to fires in {location}',
    global: 'Global tree cover loss due to fires',
  },
  categories: ['fires'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest', 'plantations'],
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
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['ha', '%'],
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
  chartType: 'rankedList',
  colors: 'lossFires',
  layers: ['loss'],
  refetchKeys: ['forestType', 'landCategory', 'threshold'],
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
  metaKey: 'umd_tree_cover_loss_from_fires',
  sortOrder: {
    fires: 6,
  },
  settings: {
    threshold: 30,
    unit: 'ha',
    pageSize: 5,
    page: 0,
    startYear: MIN_YEAR,
    endYear: MAX_YEAR,
    ifl: 2000,
    hidePercentageBar: true,
  },
  sentences: {
    initial:
      'From {startYear} to {endYear}, {topLocationLabel} had the highest rate of tree cover loss due to fires with an average of {topLocationLossAverage} lost per year.',
    withIndicator:
      'From {startYear} to {endYear}, {topLocationLabel} had the highest rate of tree cover loss due to fires in {indicator}, with an average of {topLocationLossAverage} lost per year.',
    initialPercent:
      'From {startYear} to {endYear}, {topLocationLabel} had the highest proportion of fire-related loss with {topLocationPerc} of all tree cover loss attributed to fires.',
    withIndicatorPercent:
      'From {startYear} to {endYear}, {topLocationLabel} had the highest proportion of fire-related loss in {indicator} with {topLocationPerc} of all tree cover loss attributed to fires.',
    noLoss:
      'From {startYear} to {endYear}, there was no tree cover loss from fires identified.',
    noLossIndicator:
      'From {startYear} to {endYear} in {indicator}, there was no tree cover loss from fires identified.',
  },
  getData: (params) =>
    getLossFiresGrouped(params, { grouped: true }).then((lossGrouped) => {
      let groupKey = 'iso';
      if (params.adm0) groupKey = 'adm1';
      if (params.adm1) groupKey = 'adm2';

      const lossData = lossGrouped.data.data;
      let lossMappedData = [];
      if (lossData && lossData.length) {
        const lossByRegion = groupBy(lossData, groupKey);
        lossMappedData = Object.keys(lossByRegion).map((d) => {
          const regionLoss = lossByRegion[d];
          return {
            id: groupKey === 'iso' ? d : parseInt(d, 10),
            loss: regionLoss,
          };
        });
      }

      const { startYear, endYear, range } =
        (lossMappedData[0] && getYearsRangeFromData(lossMappedData[0].loss)) ||
        {};

      return {
        lossFires: lossMappedData,
        settings: {
          startYear,
          endYear,
        },
        options: {
          years: range,
        },
      };
    }),
  getDataURL: (params) => [getLossFiresGrouped({ ...params, download: true })],
  getWidgetProps,
};
