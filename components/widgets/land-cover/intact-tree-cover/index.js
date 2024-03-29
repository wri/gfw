import { getExtent } from 'services/analysis-cached';
import { all, spread } from 'axios';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_EXTENT_DATASET,
  INTACT_FOREST_LANDSCAPES_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_EXTENT,
  TREE_COVER,
  INTACT_FOREST_LANDSCAPES,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'intactTreeCover',
  title: {
    global: 'Global Intact forest',
    initial: 'Intact forest in {location}',
  },
  categories: ['land-cover'],
  types: ['global', 'country', 'aoi', 'wdpa'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  chartType: 'pieChart',
  colors: 'extent',
  metaKey: 'widget_ifl',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      // ifl
      dataset: INTACT_FOREST_LANDSCAPES_DATASET,
      layers: [INTACT_FOREST_LANDSCAPES],
    },
    // tree cover 2010
    {
      dataset: FOREST_EXTENT_DATASET,
      layers: {
        2010: FOREST_EXTENT,
        2000: TREE_COVER,
      },
    },
  ],
  sortOrder: {
    landCover: 3,
  },
  settings: {
    forestType: 'ifl',
    threshold: 30,
    extentYear: 2000,
    ifl: 2000,
  },
  refetchKeys: ['landCategory', 'threshold', 'extentYear'],
  sentences: {
    initial:
      'As of 2000, {percentage} of {location} tree cover was <b>intact forest</b>.',
    withIndicator:
      'As of 2000, {percentage} of {location} tree cover in {indicator} was <b>intact forest</b>.',
    noIntact:
      'As of 2000, <b>none</b> of {location} tree cover was <b>intact forest</b>.',
    noIntactwithIndicator:
      'As of 2000, <b>none</b> of {location} tree cover in {indicator} was <b>intact forest</b>.',
  },
  whitelists: {
    checkStatus: true,
  },
  getData: (params) =>
    all([
      getExtent({ ...params, forestType: '' }),
      getExtent({ ...params }),
    ]).then(
      spread((adminResponse, iflResponse) => {
        const adminExtent = adminResponse.data && adminResponse.data.data;
        const iflExtent = iflResponse.data && iflResponse.data.data;
        let totalArea = 0;
        let totalExtent = 0;
        let extent = 0;
        let data = {};
        if (iflExtent.length && adminExtent.length) {
          totalArea = adminExtent.reduce((total, d) => total + d.total_area, 0);
          totalExtent = adminExtent.reduce((total, d) => total + d.extent, 0);
          extent = iflExtent.reduce((total, d) => total + d.extent, 0);
          data = {
            totalArea,
            totalExtent,
            extent,
          };
        }
        return data;
      })
    ),
  getDataURL: (params) => [
    getExtent({ ...params, forestType: '', download: true }),
    getExtent({ ...params, download: true }),
  ],
  getWidgetProps,
};
