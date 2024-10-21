import { all, spread } from 'axios';
import {
  getExtent,
  getTreeCoverOTF,
  getTropicalExtent,
} from 'services/analysis-cached';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';
import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_EXTENT_DATASET,
  TROPICAL_TREE_COVER_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_EXTENT,
  TREE_COVER,
  TROPICAL_TREE_COVER_METERS,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'naturalForest',
  title: {
    default: 'Natural forest in {location}',
    global: 'Global natural forest',
  },
  sentence: {
    default: {
      global: ``,
      region: ``,
    },
  },
  metaKey: {
    2000: 'widget_tree_cover',
    2010: 'widget_tree_cover',
    2020: 'wri_trees_in_mosaic_landscapes',
  },
  chartType: 'pieChart',
  large: false,
  colors: 'extent',
  source: 'gadm',
  categories: ['land-cover', 'summary'],
  types: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  visible: ['dashboard'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: {
        2020: TROPICAL_TREE_COVER_DATASET,
        2010: FOREST_EXTENT_DATASET,
        2000: FOREST_EXTENT_DATASET,
      },
      layers: {
        2020: TROPICAL_TREE_COVER_METERS,
        2010: FOREST_EXTENT,
        2000: TREE_COVER,
      },
    },
  ],
  sortOrder: {
    summary: 6,
    landCover: 1,
  },
  refetchKeys: ['threshold', 'decile', 'extentYear', 'landCategory'],
  pendingKeys: ['threshold', 'decile', 'extentYear'],
  settings: {
    threshold: 30,
    decile: 30,
    extentYear: 2000,
  },
  getDataType: (params) => {
    const { extentYear } = params;
    const isTropicalTreeCover = extentYear === 2020;
    return isTropicalTreeCover ? 'tropicalExtent' : 'extent';
  },
  getSettingsConfig: (params) => {
    const { extentYear } = params;
    const isTropicalTreeCover = extentYear === 2020;

    return [
      {
        key: 'extentYear',
        label: 'Tree cover dataset',
        type: 'select',
        border: true,
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
        key: isTropicalTreeCover ? 'decile' : 'threshold',
        label: 'Tree cover',
        type: 'mini-select',
        metaKey: 'widget_canopy_density',
      },
    ];
  },
  getData: (params) => {
    const { threshold, decile, ...filteredParams } = params;
    const { extentYear } = filteredParams;
    const isTropicalTreeCover = !(extentYear === 2000 || extentYear === 2010);
    const decileThreshold = isTropicalTreeCover ? { decile } : { threshold };
    const extentFn = isTropicalTreeCover ? getTropicalExtent : getExtent;

    if (shouldQueryPrecomputedTables(params)) {
      return all([
        extentFn({ ...filteredParams, ...decileThreshold }),
        extentFn({
          ...filteredParams,
          ...decileThreshold,
          forestType: '',
          landCategory: '',
        }),
        extentFn({
          ...filteredParams,
          ...decileThreshold,
          forestType: 'plantations',
        }),
      ]).then(
        spread((response, adminResponse, plantationsResponse) => {
          const extent = response.data && response.data.data;
          const adminExtent = adminResponse.data && adminResponse.data.data;
          const plantationsExtent =
            plantationsResponse.data && plantationsResponse.data.data;

          let totalArea = 0;
          let totalCover = 0;
          let cover = 0;
          let plantations = 0;
          let data = {};
          if (extent && extent.length) {
            // Sum values
            totalArea = adminExtent.reduce(
              (total, d) => total + d.total_area,
              0
            );
            cover = extent.reduce((total, d) => total + d.extent, 0);
            totalCover = adminExtent.reduce((total, d) => total + d.extent, 0);
            plantations = plantationsExtent.reduce(
              (total, d) => total + d.extent,
              0
            );
            data = {
              totalArea,
              totalCover,
              cover,
              plantations,
            };
          }
          return data;
        })
      );
    }

    return getTreeCoverOTF(params);
  },
  getDataURL: (params) => {
    const { threshold, decile, ...filteredParams } = params;
    const { extentYear } = filteredParams;
    const isTropicalTreeCover = !(extentYear === 2000 || extentYear === 2010);
    const downloadFn = isTropicalTreeCover ? getTropicalExtent : getExtent;
    const decileThreshold = isTropicalTreeCover ? { decile } : { threshold };
    const commonParams = {
      ...filteredParams,
      ...decileThreshold,
      download: true,
    };

    const downloadArray = [
      downloadFn({ ...commonParams, forestType: null, landCategory: null }),
      downloadFn({ ...commonParams, forestType: 'plantations' }),
    ];

    if (filteredParams?.landCategory) {
      downloadArray.push(downloadFn({ ...commonParams }));
    }

    return downloadArray;
  },
  getWidgetProps,
};
