import { getGlobalLandCover } from 'services/forest-data';

import {
  POLITICAL_BOUNDARIES_DATASET,
  LAND_COVER_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  LAND_COVER
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'globalLandCover',
  title: 'Land cover for {location}',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  chartType: 'pieChart',
  visible: ['dashboard', 'analysis'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      dataset: LAND_COVER_DATASET,
      layers: [LAND_COVER]
    }
  ],
  colors: 'plantations',
  metaKey: 'widget_land_cover_esa',
  hideSettings: true,
  sortOrder: {
    landCover: 100
  },
  settings: {
    year: 2015
  },
  sentences:
    'The land use of {location} in {year} is mostly {category}, covering an area of {extent}.',
  getData: params =>
    getGlobalLandCover(params).then(response => {
      const data = response.data.rows;
      return data;
    }),
  getDataURL: params => [getGlobalLandCover(params)],
  getWidgetProps
};
