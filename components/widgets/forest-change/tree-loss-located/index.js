import { getExtentGrouped, getLossGrouped } from 'services/analysis-cached';
import groupBy from 'lodash/groupBy';
import { all, spread } from 'axios';

import { getYearsRangeFromData } from 'components/widgets/utils/data';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_LOSS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_LOSS,
} from 'data/layers';

import getWidgetProps from './selectors';

const MAX_YEAR = 2021;
const MIN_YEAR = 2001;

export default {
  widget: 'treeLossLocated',
  title: 'Location of tree cover loss in {location}',
  categories: ['summary', 'forest-change'],
  subcategories: ['forest-loss'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest', 'mangroves_2016'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      whitelist: ['wdpa'],
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
      key: 'extentYear',
      label: 'extent year',
      type: 'switch',
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
  chartType: 'rankedList',
  colors: 'loss',
  layers: ['loss'],
  refetchKeys: ['forestType', 'landCategory', 'extentYear', 'threshold'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // loss
    {
      dataset: FOREST_LOSS_DATASET,
      layers: [FOREST_LOSS],
    },
  ],
  metaKey: 'widget_tree_cover_loss_location',
  sortOrder: {
    summary: 2,
    forestChange: 3,
  },
  settings: {
    threshold: 30,
    extentYear: 2000,
    unit: 'ha',
    pageSize: 5,
    page: 0,
    startYear: MIN_YEAR,
    endYear: MAX_YEAR,
    ifl: 2000,
  },
  sentences: {
    initial:
      'In {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most tree cover loss at {value} compared to an average of {average}.',
    withIndicator:
      'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most tree cover loss at {value} compared to an average of {average}.',
    initialPercent:
      'In {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most relative tree cover loss at {value} compared to an average of {average}.',
    withIndicatorPercent:
      'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most relative tree cover loss at {value} compared to an average of {average}.',
    noLoss: 'There was no tree cover loss identified in {location}.',
  },
  getData: (params) =>
    all([getExtentGrouped(params), getLossGrouped(params)]).then(
      spread((extentGrouped, lossGrouped) => {
        const extentData = extentGrouped.data.data || [];
        const lossData = lossGrouped.data.data || [];
        const { adm0, adm1 } = params;

        let groupKey = 'iso';

        if (adm0) groupKey = 'adm1';
        if (adm1) groupKey = 'adm2';

        const extentMappedData = extentData.map((extentItem) => {
          const { extent = 0, total = 0 } = extentItem;
          const extentGroupKey = extentItem[groupKey];

          return {
            id:
              groupKey === 'iso'
                ? extentGroupKey
                : parseInt(extentGroupKey, 10),
            extent,
            percentage: (extent / total) * 100,
          };
        });

        const lossByRegion = groupBy(lossData, groupKey);
        const lossMappedData = Object.keys(lossByRegion).map((regionIndex) => ({
          id: groupKey === 'iso' ? regionIndex : parseInt(regionIndex, 10),
          loss: lossByRegion[regionIndex],
        }));

        /* lossItemReference is for reference of startYear, endYear and range. 
          The perfect item should have all the years to set the variables */
        const lossItemReference = lossMappedData.findIndex(({ loss }) =>
          loss.find(({ umd_tree_cover_loss__year: year }) => year >= MAX_YEAR)
        );

        const { startYear, endYear, range } = getYearsRangeFromData(
          lossMappedData[lossItemReference].loss
        );

        return {
          lossByRegion: lossMappedData,
          extent: extentMappedData,
          settings: {
            startYear,
            endYear,
          },
          options: {
            years: range,
          },
        };
      })
    ),
  getDataURL: (params) => [
    getExtentGrouped({ ...params, download: true }),
    getLossGrouped({ ...params, download: true }),
  ],
  getWidgetProps,
};
