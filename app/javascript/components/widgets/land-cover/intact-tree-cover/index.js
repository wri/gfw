import { getExtent } from 'services/analysis-cached';
import { all, spread } from 'axios';

import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_EXTENT_DATASET,
  INTACT_FOREST_LANDSCAPES_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_EXTENT,
  TREE_COVER,
  INTACT_FOREST_LANDSCAPES
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'intactTreeCover',
  title: {
    global: 'Global Intact forest',
    initial: 'Intact forest in {location}'
  },
  categories: ['land-cover'],
  types: ['global', 'country', 'geostore'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
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
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  chartType: 'pieChart',
  colors: 'extent',
  metaKey: 'widget_ifl',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      // ifl
      dataset: INTACT_FOREST_LANDSCAPES_DATASET,
      layers: [INTACT_FOREST_LANDSCAPES]
    },
    // tree cover 2010
    {
      dataset: FOREST_EXTENT_DATASET,
      layers: {
        2010: FOREST_EXTENT,
        2000: TREE_COVER
      }
    }
  ],
  sortOrder: {
    landCover: 3
  },
  settings: {
    forestType: 'ifl',
    threshold: 30,
    extentYear: 2010,
    ifl: 2016
  },
  refetchKeys: ['landCategory', 'threshold', 'extentYear'],
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
