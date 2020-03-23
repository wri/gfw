import {
  getExtentGrouped,
  getAreaIntersectionGrouped
} from 'services/analysis-cached';
import { all, spread } from 'axios';

import {
  POLITICAL_BOUNDARIES_DATASET,
  TREE_PLANTATIONS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  TREE_PLANTATIONS
} from 'data/layers';

import getWidgetProps from './selectors';

export default {
  widget: 'rankedPlantations',
  title: 'Location of plantations in {location}',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1'],
  metaKey: 'widget_plantations_ranked',
  colors: 'plantations',
  chartType: 'horizontalBarChart',
  dataTypes: 'plantations',
  layers: ['plantations_by_type', 'plantations_by_species'],
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    {
      // global plantations
      dataset: TREE_PLANTATIONS_DATASET,
      layers: [TREE_PLANTATIONS]
    }
  ],
  sortOrder: {
    landCover: 101
  },
  settings: {
    threshold: 10,
    pageSize: 5,
    page: 0,
    extentYear: 2000
  },
  sentence:
    '{region} has the largest relative plantation area in {location} at {percentage}, most of which is in {topType}.',
  whitelists: {
    indicators: ['plantations']
  },
  getData: params =>
    all([
      getExtentGrouped(params),
      getAreaIntersectionGrouped({
        ...params,
        forestType: 'plantations',
        summary: true
      })
    ]).then(
      spread((extentGrouped, plantationsExtentResponse) => {
        let data = {};
        const extent = extentGrouped.data && extentGrouped.data.data;
        const plantationsExtent =
          plantationsExtentResponse.data && plantationsExtentResponse.data.data;
        if (extent.length && plantationsExtent.length) {
          data = {
            extent,
            plantations: plantationsExtent
          };
        }

        return data;
      })
    ),
  getDataURL: params => [
    getExtentGrouped({ ...params, download: true }),
    getAreaIntersectionGrouped({
      ...params,
      forestType: 'plantations',
      download: true,
      summary: true
    })
  ],
  getWidgetProps
};
