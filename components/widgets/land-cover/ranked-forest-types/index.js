import {
  getTreeCoverByLandCoverClass,
  getTropicalExtent
} from 'services/analysis-cached';

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

export default {
  widget: 'rankedForestTypes',
  title: 'Tree cover by land cover class in {location}',
  sentence:
    'In {extentYear}, {location} had {canopyCover} in the following land cover classes:',
  categories: ['summary', 'land-cover'],
  large: true,
  autoHeight: true,
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All land cover',
      clearable: true,
    },
    {
      key: 'decile',
      label: 'tree cover',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  refetchKeys: ['forestType', 'decile'],
  chartType: 'infoList',
  // TODO: Add metakey when available
  // metaKey: '',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: FOREST_GAIN_DATASET,
      layers: [FOREST_GAIN],
    },
  ],
  visible: ['dashboard'],
  sortOrder: {
    // TODO: Set correct sortOrder
    summary: -10,
    landCover: -10,
  },
  settings: {
    decile: 30,
    extentYear: 2020,
  },
  getData: (params) => {
    return getTreeCoverByLandCoverClass(params);
  },
  getDataURL: (params) => {
    return [
      getTropicalExtent({ ...params, forestType: null, download: true }),
      getTropicalExtent({ ...params, forestType: 'plantations', download: true }),
      ...(params?.forestType ? getTropicalExtent({ ...params, download: true }) : []),
    ];
  },
  getWidgetProps,
};
