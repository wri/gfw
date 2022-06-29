import { getExtentFires, getLossFires } from 'services/analysis-cached';
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
      whitelist: ['ifl', 'primary_forest', 'mangroves_2016'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      blacklist: ['wdpa'],
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
    // {
    //   key: 'extentYear',
    //   label: 'extent year',
    //   type: 'switch',
    //   border: true,
    // },
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
      dataset: FOREST_LOSS_DATASET,
      layers: [FOREST_LOSS],
    },
  ],
  metaKey: 'widget_tree_cover_loss_fires_location',
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
      'From {startYear} to {endYear}, {topLocationLabel} had the highest rate of tree cover loss due to fires with an average of {topLocationLoss} lost per year.',
    // withIndicator:
    //   'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most tree cover loss at {value} compared to an average of {average}.',
    initialPercent:
      'From {startYear} to {endYear}, {topLocationLabel} had the highest proportion of fire-related loss with {topLocationPerc} of all tree cover loss attributed to fires.',
    // withIndicatorPercent:
    //   'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topLoss} of all tree cover loss between {startYear} and {endYear}. {region} had the most relative tree cover loss at {value} compared to an average of {average}.',
    noLoss: 'There was no tree cover loss from fires identified in {location}.',
  },
  getData: (params) =>
    all([getExtentFires(params), getLossFires(params)]).then(
      spread((extentGrouped, lossGrouped) => {
        let groupKey = 'iso';
        if (params.adm0) groupKey = 'adm1';
        if (params.adm1) groupKey = 'adm2';

        const extentData = extentGrouped.data.data;
        let extentMappedData = {};
        if (extentData && extentData.length) {
          extentMappedData = extentData.map((d) => ({
            id: groupKey === 'iso' ? d[groupKey] : parseInt(d[groupKey], 10),
            extent: d.extent || 0,
            percentage: d.extent ? (d.extent / d.total) * 100 : 0,
          }));
        }
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
          (lossMappedData[0] &&
            getYearsRangeFromData(lossMappedData[0].loss)) ||
          {};

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
    getExtentFires({ ...params, download: true }),
    getLossFires({ ...params, download: true }),
  ],
  getWidgetProps,
};
