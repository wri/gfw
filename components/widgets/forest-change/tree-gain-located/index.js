import { getExtentGrouped, getGainGrouped } from 'services/analysis-cached';
import { all, spread } from 'axios';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_GAIN_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_GAIN,
} from 'data/layers';

import getWidgetProps from './selectors';

const MIN_YEAR = 2000;

export default {
  widget: 'treeGainLocated',
  title: 'Location of tree cover gain in {location}',
  categories: ['forest-change'],
  subcategories: ['forest-gain'],
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
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'baselineYear',
      label: 'Baseline Year',
      type: 'baseline-select',
      startKey: 'startYear',
      placeholder: MIN_YEAR,
      clearable: true,
    },
  ],
  refetchKeys: ['forestType', 'landCategory', 'startYear'],
  chartType: 'rankedList',
  colors: 'gain',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // gain
    {
      dataset: FOREST_GAIN_DATASET,
      layers: [FOREST_GAIN],
    },
  ],
  metaKey: 'umd_tree_cover_gain_from_height',
  dataType: 'gain',
  sortOrder: {
    forestChange: 6,
  },
  sentences: {
    initial:
      'In {location}, the top {percentileLength} were responsible for {topGain}% of all tree cover gain between {baselineYear} and 2020. {region} had the most tree cover gain at {value} compared to an average of {average} in that time period.',
    withIndicator:
      'For {indicator} in {location}, the top {percentileLength} were responsible for {topGain}% of all tree cover gain between {baselineYear} and 2020. {region} had the most tree cover gain at {value} compared to an average of {average} in that time period.',
    initialPercent:
      'In {location}, the top {percentileLength} were responsible for {topGain}% of all tree cover gain between {baselineYear} and 2020. {region} had the most tree cover gain at {value} compared to an average of {average} in that time period.',
    withIndicatorPercent:
      'For {indicator} in {location}, the top {percentileLength} were responsible for {topGain}% of all tree cover gain between {baselineYear} and 2020. {region} had the most tree cover gain at {value} compared to an average of {average} in that time period.',
  },
  settings: {
    threshold: 0,
    unit: 'ha',
    pageSize: 5,
    page: 0,
    extentYear: 2000,
    ifl: 2000,
    startYear: MIN_YEAR,
    endYear: 2020, // reference to display the correct data on the map
  },
  getData: (params) =>
    all([getExtentGrouped(params), getGainGrouped(params)]).then(
      spread((extentGrouped, gainGrouped) => {
        let groupKey = 'iso';
        if (params.adm0) groupKey = 'adm1';
        if (params.adm1) groupKey = 'adm2';

        const extentData = extentGrouped.data.data;
        let extentMappedData = {};
        if (extentData && extentData.length) {
          extentMappedData = extentData.map((d) => ({
            id: d[groupKey],
            extent: d.extent || 0,
            percentage: d.extent ? (d.extent / d.total_area) * 100 : 0,
          }));
        }

        const gainData = gainGrouped.data.data;
        let gainMappedData = {};
        if (gainData && gainData.length) {
          gainMappedData = gainData.map((d) => ({
            id: d[groupKey],
            gain: d.gain || 0,
          }));
        }

        return {
          gain: gainMappedData,
          extent: extentMappedData,
        };
      })
    ),
  getDataURL: (params) => [
    getExtentGrouped({ ...params, download: true }),
    getGainGrouped({ ...params, download: true }),
  ],
  getWidgetProps,
};
