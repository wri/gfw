import { getExtentGrouped } from 'services/analysis-cached';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_EXTENT_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_EXTENT,
  TREE_COVER,
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'treeCoverRanked',
  title: 'Forest in {location} compared to other areas',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0'],
  colors: 'extent',
  dataType: 'extent',
  chartType: 'rankedList',
  metaKey: 'widget_forest_cover_ranking',
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl'],
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
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['ha', '%'],
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch',
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // tree cover
    {
      dataset: FOREST_EXTENT_DATASET,
      layers: {
        2010: FOREST_EXTENT,
        2000: TREE_COVER,
      },
    },
  ],
  sortOrder: {
    summary: 1,
    landCover: 1.1,
  },
  refetchKeys: ['threshold', 'extentYear', 'forestType', 'landCategory'],
  settings: {
    threshold: 30,
    unit: 'ha',
    extentYear: 2000,
    ifl: 2000,
  },
  sentences: {
    initial:
      'As of {extentYear}, {location} had {extent} of tree cover, equivalent to {landPercentage} of its land area and {globalPercentage} of the global total.',
    landCatOnly:
      'As of {extentYear}, {location} had {extent} of tree cover in {indicator}, equivalent to {landPercentage} of its land area and {globalPercentage} of the global total.',
    withInd:
      'As of {extentYear}, {location} had {extent} of {indicator}, equivalent to {landPercentage} of its land area and {globalPercentage} of the global total.',
  },
  getData: (params) => {
    const { adm0, adm1, adm2, ...rest } = params || {};
    const parentLocation = {
      adm0: adm0 && !adm1 ? null : adm0,
      adm1: adm1 && !adm2 ? null : adm1,
      adm2: null,
    };
    const getAdminLevel = () => {
      let adminKey = 'iso';
      if (adm2) adminKey = 'adm2';
      else if (adm1) adminKey = 'adm1';
      return adminKey;
    };
    return getExtentGrouped({ ...rest, ...parentLocation }).then((response) => {
      const { data } = response.data;
      let mappedData = [];
      if (data && data.length) {
        mappedData = data.map((item) => {
          const area = item.total_area || 0;
          const extent = item.extent || 0;
          return {
            id: item[getAdminLevel()],
            extent,
            area,
            percentage: extent ? (100 * extent) / area : 0,
          };
        });
      }
      return mappedData;
    });
  },
  getDataURL: (params) => {
    const { adm0, adm1, adm2, ...rest } = params || {};
    const parentLocation = {
      adm0: adm0 && !adm1 ? null : adm0,
      adm1: adm1 && !adm2 ? null : adm1,
      adm2: null,
    };
    return [getExtentGrouped({ ...rest, ...parentLocation, download: true })];
  },
  getWidgetProps,
};
