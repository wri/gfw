import { getExtentGrouped, getGainGrouped } from 'services/analysis-cached';
import { all, spread } from 'axios';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_GAIN_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_GAIN
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'treeGainLocated',
  title: 'Location of tree cover gain in {location}',
  categories: ['forest-change'],
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
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    }
  ],
  refetchKeys: ['forestType', 'landCategory'],
  chartType: 'lollipop',
  colors: 'gain',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // gain
    {
      dataset: FOREST_GAIN_DATASET,
      layers: [FOREST_GAIN]
    }
  ],
  metaKey: 'widget_tree_cover_gain_location',
  sortOrder: {
    forestChange: 6
  },
  sentences: {
    initial:
      'In {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain between 2001 and 2012. {region} had the most tree cover gain at {value} compared to an average of {average}.',
    withIndicator:
      'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain between 2001 and 2012. {region} had the most tree cover gain at {value} compared to an average of {average}.',
    initialPercent:
      'In {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain between 2001 and 2012. {region} had the most relative tree cover gain at {value} compared to an average of {average}.',
    withIndicatorPercent:
      'For {indicator} in {location}, the top {percentileLength} regions were responsible for {topGain} of all tree cover gain between 2001 and 2012. {region} had the most relative tree cover gain at {value} compared to an average of {average}.'
  },
  settings: {
    threshold: 50,
    unit: 'ha',
    pageSize: 5,
    page: 0,
    extentYear: 2000,
    ifl: 2000
  },
  getData: params =>
    all([getExtentGrouped(params), getGainGrouped(params)]).then(
      spread((extentGrouped, gainGrouped) => {
        let groupKey = 'iso';
        if (params.adm0) groupKey = 'adm1';
        if (params.adm1) groupKey = 'adm2';

        const extentData = extentGrouped.data.data;
        let extentMappedData = {};
        if (extentData && extentData.length) {
          extentMappedData = extentData.map(d => ({
            id: d[groupKey],
            extent: d.extent || 0,
            percentage: d.extent ? d.extent / d.total_area * 100 : 0
          }));
        }

        const gainData = gainGrouped.data.data;
        let gainMappedData = {};
        if (gainData && gainData.length) {
          gainMappedData = gainData.map(d => ({
            id: d[groupKey],
            gain: d.gain || 0
          }));
        }

        return {
          gain: gainMappedData,
          extent: extentMappedData
        };
      })
    ),
  getDataURL: params => [
    getExtentGrouped({ ...params, download: true }),
    getGainGrouped({ ...params, download: true })
  ],
  getWidgetProps
};
