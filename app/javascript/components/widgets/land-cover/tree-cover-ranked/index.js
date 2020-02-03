import { getExtentGrouped } from 'services/forest-data-old';

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
      clearable: true
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'unit',
      label: 'unit',
      type: 'switch',
      whitelist: ['ha', '%']
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
  datasets: [
    {
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    // tree cover
    {
      dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
      layers: {
        2010: '78747ea1-34a9-4aa7-b099-bdb8948200f4',
        2000: 'c05c32fd-289c-4b20-8d73-dc2458234e04'
      }
    }
  ],
  sortOrder: {
    summary: 1,
    landCover: 1
  },
  refetchKeys: ['threshold', 'extentYear', 'forestType', 'landCategory'],
  settings: {
    threshold: 30,
    unit: '%',
    extentYear: 2000,
    ifl: 2000
  },
  sentences: {
    initial:
      'As of {extentYear}, {location} had {extent} of tree cover, equivalent to {landPercentage} of its land area and {globalPercentage} of the global total.',
    landCatOnly:
      'As of {extentYear}, {location} had {extent} of tree cover in {indicator}, equivalent to {landPercentage} of its land area and {globalPercentage} of the global total.',
    withInd:
      'As of {extentYear}, {location} had {extent} of {indicator}, equivalent to {landPercentage} of its land area and {globalPercentage} of the global total.'
  },
  getData: params => {
    const { adm0, adm1, adm2, ...rest } = params || {};
    const parentLocation = {
      adm0: adm0 && !adm1 ? null : adm0,
      adm1: adm1 && !adm2 ? null : adm1,
      adm2: null
    };
    return getExtentGrouped({ ...rest, ...parentLocation }).then(response => {
      const { data } = response.data;
      let mappedData = [];
      if (data && data.length) {
        mappedData = data.map(item => {
          const area = item.total_area || 0;
          const extent = item.extent || 0;
          return {
            id: item.iso,
            extent,
            area,
            percentage: extent ? 100 * extent / area : 0
          };
        });
      }
      return mappedData;
    });
  },
  getDataURL: params => {
    const { adm0, adm1, adm2, ...rest } = params || {};
    const parentLocation = {
      adm0: adm0 && !adm1 ? null : adm0,
      adm1: adm1 && !adm2 ? null : adm1,
      adm2: null
    };
    return [getExtentGrouped({ ...rest, ...parentLocation, download: true })];
  },
  getWidgetProps
};
