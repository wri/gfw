/* eslint-disable no-unused-vars */
import { all, spread } from 'axios';

export default {
  widget: 'naturalForest',
  title: {
    default: 'Natural forest in {location}',
    global: 'Global natural forest',
  },
  sortOrder: {
    landCover: 1,
  },
  sentence: {
    default: {
      global:
        'As of 2020, [percent natural forests]% of global land cover was natural forests and [percent non-natural forests]% was non-natural tree cover.',
      region:
        'As of 2020, [percent natural forests]% of land cover in [area] was natural forests and [percent non-natural forests]% was non-natural tree cover.',
    },
  },
  chartType: 'pieChart',
  large: false,
  colors: 'extent',
  settings: {
    threshold: 30,
    decile: 30,
    extentYear: 2000,
  },
  categories: ['land-cover'],
  types: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  visible: ['dashboard'],
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
    return [];
  },
  getDataURL: (params) => {
    return [];
  },
};
