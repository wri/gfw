import { getExtentGrouped, getLossGrouped } from 'services/analysis-cached';
import groupBy from 'lodash/groupBy';
import { all, spread } from 'axios';

import { getYearsRange } from 'components/widgets/utils/data';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_LOSS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_LOSS
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'treeLossLocated',
  title: 'Location of tree cover loss in {location}',
  categories: ['summary', 'forest-change'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest', 'mangroves_2016'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      whitelist: ['wdpa'],
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['ha', '%']
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch',
      border: true
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  chartType: 'rankedList',
  colors: 'loss',
  layers: ['loss'],
  refetchKeys: ['forestType', 'landCategory', 'extentYear', 'threshold'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // loss
    {
      dataset: FOREST_LOSS_DATASET,
      layers: [FOREST_LOSS]
    }
  ],
  metaKey: 'widget_tree_cover_loss_location',
  sortOrder: {
    summary: 2,
    forestChange: 3
  },
  settings: {
    threshold: 30,
    extentYear: 2000,
    unit: '%',
    pageSize: 5,
    page: 0,
    startYear: 2001,
    endYear: 2018,
    ifl: 2000
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
    noLoss: 'There was no tree cover loss identified in {location}.'
  },
  getData: params =>
    all([getExtentGrouped(params), getLossGrouped(params)]).then(
      spread((extentGrouped, lossGrouped) => {
        let groupKey = 'iso';
        if (params.adm0) groupKey = 'adm1';
        if (params.adm1) groupKey = 'adm2';

        const extentData = extentGrouped.data.data;
        let extentMappedData = {};
        if (extentData && extentData.length) {
          extentMappedData = extentData.map(d => ({
            id: groupKey === 'iso' ? d[groupKey] : parseInt(d[groupKey], 10),
            extent: d.extent || 0,
            percentage: d.extent ? d.extent / d.total * 100 : 0
          }));
        }
        const lossData = lossGrouped.data.data;
        let lossMappedData = [];
        if (lossData && lossData.length) {
          const lossByRegion = groupBy(lossData, groupKey);
          lossMappedData = Object.keys(lossByRegion).map(d => {
            const regionLoss = lossByRegion[d];
            return {
              id: groupKey === 'iso' ? d : parseInt(d, 10),
              loss: regionLoss
            };
          });
        }

        const { startYear, endYear, range } =
          (lossMappedData[0] && getYearsRange(lossMappedData[0].loss)) || {};

        return {
          lossByRegion: lossMappedData,
          extent: extentMappedData,
          settings: {
            startYear,
            endYear
          },
          options: {
            years: range
          }
        };
      })
    ),
  getDataURL: params => [
    getExtentGrouped({ ...params, download: true }),
    getLossGrouped({ ...params, download: true })
  ],
  getWidgetProps
};
