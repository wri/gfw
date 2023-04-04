import {
  getTreeCoverByLandCoverClass,
  getTropicalExtent,
} from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  TROPICAL_TREE_COVER_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  TROPICAL_TREE_COVER_METERS,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'rankedForestTypes',
  title: 'Tree cover by land cover class in {location}',
  sentences: {
    default:
      'In {extentYear}, {location} had {canopyCover} in the following land cover classes:',
    withIndicator:
      'In {extentYear}, {indicator} in {location} had {canopyCover} tree cover in the following land cover classes:',
  },
  categories: ['land-cover'],
  large: true,
  autoHeight: true,
  colors: 'extent',
  dataType: 'tropicalTreeCover',
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
  metaKey: 'wri_trees_in_mosaic_landscapes',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: TROPICAL_TREE_COVER_DATASET,
      layers: [TROPICAL_TREE_COVER_METERS],
    },
  ],
  visible: ['dashboard'],
  sortOrder: {
    landCover: 2,
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
      getTropicalExtent({
        ...params,
        forestType: 'plantations',
        download: true,
      }),
      ...(params?.forestType
        ? getTropicalExtent({ ...params, download: true })
        : []),
    ];
  },
  getWidgetProps,
};
