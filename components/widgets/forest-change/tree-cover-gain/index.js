import { all, spread } from 'axios';

import { getGainGrouped } from 'services/analysis-cached';

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
  widget: 'treeCoverGain',
  title: {
    global: 'Global tree cover gain',
    initial: 'Tree cover gain in {location} compared to other areas',
  },
  categories: ['summary', 'forest-change'],
  subcategories: ['forest-gain'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest'],
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
  refetchKeys: ['forestType', 'landCategory', 'threshold', 'startYear'],
  chartType: 'rankedList',
  colors: 'gain',
  metaKey: 'umd_tree_cover_gain_from_height',
  dataType: 'gain',
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
  visible: ['dashboard', 'analysis'],
  sortOrder: {
    summary: 3,
    forestChange: 7,
  },
  sentences: {
    globalInitial:
      'From {baselineYear} to 2020, {gain} of tree cover was gained {location}.',
    globalWithIndicator:
      'From {baselineYear} to 2020, {gain} of tree cover was gained within {indicator} {location}.',
    initial:
      'From {baselineYear} to 2020, {location} gained {gain} of tree cover equal to {gainPercent} of the global total.',
    withIndicator:
      'From {baselineYear} to 2020, {location} gained {gain} of tree cover in {indicator} equal to {gainPercent} of the global total.',
    regionInitial:
      'From {baselineYear} to 2020, {location} gained {gain} of tree cover {indicator} equal to {gainPercent} of all tree cover gain in {parent}.',
    regionWithIndicator:
      'From {baselineYear} to 2020, {location} gained {gain} of tree cover in {indicator} equal to {gainPercent} of all tree cover gain in {parent}.',
  },
  settings: {
    threshold: 0,
    startYear: MIN_YEAR,
    endYear: 2020, // reference to display the correct data on the map
    unit: 'ha',
    pageSize: 5,
    page: 0,
    ifl: 2000,
  },
  getData: (params) => {
    const { adm0, adm1, adm2, ...rest } = params || {};
    const parentLocation = {
      adm0: adm0 && !adm1 ? null : adm0,
      adm1: adm1 && !adm2 ? null : adm1,
      adm2: null,
    };

    return all([getGainGrouped({ ...rest, ...parentLocation })]).then(
      spread((gainResponse) => {
        let groupKey = 'iso';

        if (adm1) groupKey = 'adm1';
        if (adm2) groupKey = 'adm2';

        const gainData = gainResponse.data.data;
        let mappedData = [];

        if (gainData && gainData.length) {
          mappedData = gainData.map((item) => {
            const gain = item.gain || 0;
            const extent = item.extent || 0;

            return {
              id:
                groupKey !== 'iso'
                  ? parseInt(item[groupKey], 10)
                  : item[groupKey],
              gain,
              extent,
              percentage: extent ? (100 * gain) / extent : 0,
            };
          });
        }

        return mappedData;
      })
    );
  },
  getDataURL: (params) => [getGainGrouped({ ...params, download: true })],
  getWidgetProps,
};
