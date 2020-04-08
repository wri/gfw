import { all, spread } from 'axios';
import { getExtent } from 'services/analysis-cached';
import { fetchAnalysisEndpoint } from 'services/analysis';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';
import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_EXTENT_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_EXTENT,
  TREE_COVER
} from 'data/layers';

import getWidgetProps from './selectors';

export const getDataAPI = params =>
  fetchAnalysisEndpoint({
    ...params,
    name: 'umd',
    params,
    slug: 'umd-loss-gain',
    version: 'v1',
    aggregate: false
  }).then(response => {
    const { data } = (response && response.data) || {};
    const totalArea = data && data.attributes.areaHa;
    const exentKey =
      params.extentYear === 2010 ? 'treeExtent2010' : 'treeExtent';
    const totalCover = data && data.attributes[exentKey];

    return {
      totalArea,
      totalCover,
      cover: totalCover,
      plantations: 0
    };
  });

export default {
  widget: 'treeCover',
  title: {
    default: 'Tree cover in {location}',
    global: 'Global tree cover',
    withPlantations: 'Forest cover in {location}'
  },
  sentence: {
    globalInitial:
      'As of {year}, {percentage} of {location} land cover was tree cover.',
    globalWithIndicator:
      'As of {year}, {percentage} of {location} tree cover was in {indicator}.',
    initial: 'As of {year}, {percentage} of {location}',
    hasPlantations: ' was natural forest cover.',
    noPlantations: ' was tree cover.',
    hasPlantationsInd: "<b>'s</b> natural forest was in {indicator}.",
    noPlantationsInd: "<b>'s</b> tree cover was in {indicator}."
  },
  metaKey: 'widget_tree_cover',
  chartType: 'pieChart',
  large: false,
  colors: 'extent',
  source: 'gadm',
  dataType: 'extent',
  categories: ['summary', 'land-cover'],
  types: ['global', 'country', 'geostore', 'wdpa', 'use'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  visible: ['dashboard'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      dataset: FOREST_EXTENT_DATASET,
      layers: {
        2010: FOREST_EXTENT,
        2000: TREE_COVER
      }
    }
  ],
  sortOrder: {
    summary: 4,
    landCover: 1
  },
  refetchKeys: ['threshold', 'extentYear', 'landCategory'],
  pendingKeys: ['threshold', 'extentYear'],
  settingsConfig: [
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch',
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  settings: {
    threshold: 30,
    extentYear: 2000
  },
  getData: params => {
    if (shouldQueryPrecomputedTables(params)) {
      return all([
        getExtent(params),
        getExtent({ ...params, forestType: '', landCategory: '' }),
        getExtent({ ...params, forestType: 'plantations' })
      ]).then(
        spread((response, adminResponse, plantationsResponse) => {
          const extent = response.data && response.data.data;
          const adminExtent = adminResponse.data && adminResponse.data.data;
          let totalArea = 0;
          let totalCover = 0;
          let cover = 0;
          let plantations = 0;
          let data = {};
          if (extent && extent.length) {
            totalArea = adminExtent[0].total_area;
            cover = extent[0].extent;
            totalCover = adminExtent[0].extent;
            data = {
              totalArea,
              totalCover,
              cover,
              plantations
            };
          }
          if (params.forestType || params.landCategory) {
            return data;
          }
          // if plantations get more data
          const plantationsData =
            plantationsResponse.data && plantationsResponse.data.data;
          plantations =
            plantationsData && plantationsData.length
              ? plantationsData[0].extent
              : 0;
          if (extent && extent.length) {
            data = {
              ...data,
              plantations
            };
          }

          return data;
        })
      );
    }

    return getDataAPI(params);
  },
  getDataURL: params => {
    const urlArr =
      params.forestType || params.landCategory
        ? [getExtent({ ...params, download: true })]
        : [];

    return urlArr.concat([
      getExtent({
        ...params,
        forestType: null,
        landCategory: null,
        download: true
      }),
      getExtent({ ...params, forestType: 'plantations', download: true })
    ]);
  },
  getWidgetProps
};
