import { getExtentGrouped, getGainGrouped } from 'services/forest-data';
import axios from 'axios';

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
  chartType: 'rankedList',
  colors: 'gain',
  datasets: [
    {
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    // gain
    {
      dataset: '70e2549c-d722-44a6-a8d7-4a385d78565e',
      layers: ['3b22a574-2507-4b4a-a247-80057c1a1ad4']
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
    axios.all([getExtentGrouped(params), getGainGrouped(params)]).then(
      axios.spread((extentGrouped, gainGrouped) => {
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
  getWidgetProps
};
