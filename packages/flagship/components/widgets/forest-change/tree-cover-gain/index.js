import { all, spread } from 'axios';

import { getGainGrouped } from 'services/analysis-cached';

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
  widget: 'treeCoverGain',
  title: {
    global: 'Global tree cover gain',
    initial: 'Tree cover gain in {location} compared to other areas'
  },
  categories: ['summary', 'forest-change'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  refetchKeys: ['forestType', 'landCategory', 'threshold'],
  chartType: 'rankedList',
  colors: 'gain',
  metaKey: 'widget_tree_cover_gain',
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
  visible: ['dashboard', 'analysis'],
  sortOrder: {
    summary: 3,
    forestChange: 7
  },
  sentences: {
    globalInitial:
      'From 2001 to 2012, {gain} of tree cover was gained {location}.',
    globalWithIndicator:
      'From 2001 to 2012, {gain} of tree cover was gained within {indicator} {location}.',
    initial:
      'From 2001 to 2012, {location} gained {gain} of tree cover equal to {gainPercent} of the global total.',
    withIndicator:
      'From 2001 to 2012, {location} gained {gain} of tree cover in {indicator} equal to {gainPercent} of the global total.',
    regionInitial:
      'From 2001 to 2012, {location} gained {gain} of tree cover {indicator} equal to {gainPercent} of all tree cover gain in {parent}.',
    regionWithIndicator:
      'From 2001 to 2012, {location} gained {gain} of tree cover in {indicator} equal to {gainPercent} of all tree cover gain in {parent}.'
  },
  settings: {
    threshold: 50,
    unit: 'ha',
    pageSize: 5,
    page: 0,
    ifl: 2000
  },
  getData: params => {
    const { adm0, adm1, adm2, ...rest } = params || {};
    const parentLocation = {
      adm0: adm0 && !adm1 ? null : adm0,
      adm1: adm1 && !adm2 ? null : adm1,
      adm2: null
    };
    return all([getGainGrouped({ ...rest, ...parentLocation })]).then(
      spread(gainResponse => {
        let groupKey = 'iso';
        if (adm1) groupKey = 'adm1';
        if (adm2) groupKey = 'adm2';
        const gainData = gainResponse.data.data;
        let mappedData = [];
        if (gainData && gainData.length) {
          mappedData = gainData.map(item => {
            const gain = item.gain || 0;
            const extent = item.extent || 0;
            return {
              id:
                groupKey !== 'iso'
                  ? parseInt(item[groupKey], 10)
                  : item[groupKey],
              gain,
              extent,
              percentage: extent ? 100 * gain / extent : 0
            };
          });
        }
        return mappedData;
      })
    );
  },
  getDataURL: params => [getGainGrouped({ ...params, download: true })],
  getWidgetProps
};
