import { getExtent } from 'services/analysis-cached';
import { all, spread } from 'axios';

import { POLITICAL_BOUNDARIES_DATASET } from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'treeLossWithin',
  title: {
    global: 'Global Tree loss within {indicator}',
    initial: 'Tree loss within {indicator} {location}'
  },
  categories: ['forest-change'],
  types: ['global', 'country', 'geostore'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
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
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  chartType: 'pieChart',
  colors: 'loss',
  metaKey: '',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    }
  ],
  sortOrder: {
    forestChange: -1
  },
  settings: {
    forestType: 'ifl',
    landCategory: 'ifl',
    threshold: 30
  },
  refetchKeys: ['forestType', 'landCategory', 'threshold'],
  sentences: {
    initial:
      'As of 2016, {percentage} of {location} tree cover was <b>intact forest</b>.',
    withIndicator:
      'As of 2016, {percentage} of {location} tree cover in {indicator} was <b>intact forest</b>.',
    noIntact:
      'As of 2016, <b>none</b> of {location} tree cover was <b>intact forest</b>.',
    noIntactwithIndicator:
      'As of 2016, <b>none</b> of {location} tree cover in {indicator} was <b>intact forest</b>.'
  },
  whitelists: {
    checkStatus: true
  },
  getData: params =>
    all([
      getExtent({ ...params, forestType: '' }),
      getExtent({ ...params }),
      getExtent({ ...params, forestType: 'plantations' })
    ]).then(
      spread((gadm28Response, iflResponse, plantationsResponse) => {
        const gadmExtent = gadm28Response.data && gadm28Response.data.data;
        const iflExtent = iflResponse.data && iflResponse.data.data;
        let totalArea = 0;
        let totalExtent = 0;
        let extent = 0;
        let plantations = 0;
        let data = {};
        const plantationsData =
          plantationsResponse.data && plantationsResponse.data.data;
        plantations = plantationsData.length ? plantationsData[0].extent : 0;
        if (iflExtent.length && gadmExtent.length) {
          totalArea = gadmExtent[0].total_area;
          totalExtent = gadmExtent[0].extent;
          extent = iflExtent[0].extent;
          data = {
            totalArea,
            totalExtent,
            extent,
            plantations
          };
        }
        return data;
      })
    ),
  getDataURL: params => [
    getExtent({ ...params, forestType: '', download: true }),
    getExtent({ ...params, download: true }),
    getExtent({ ...params, forestType: 'plantations', download: true })
  ],
  getWidgetProps
};
