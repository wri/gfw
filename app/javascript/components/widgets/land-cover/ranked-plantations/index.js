import {
  getExtentGrouped,
  getAreaIntersectionGrouped
} from 'services/analysis-cached';
import axios from 'axios';

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
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    {
      // global plantations
      dataset: 'bb1dced4-3ae8-4908-9f36-6514ae69713f',
      layers: ['b8fb6cc8-6893-4ae0-8499-1ca9f1ababf4']
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
    axios
      .all([
        getExtentGrouped(params),
        getAreaIntersectionGrouped({ ...params, forestType: 'plantations' })
      ])
      .then(
        axios.spread((extentGrouped, plantationsExtentResponse) => {
          let data = {};
          const extent = extentGrouped.data && extentGrouped.data.data;
          const plantationsExtent =
            plantationsExtentResponse.data &&
            plantationsExtentResponse.data.data;
          if (extent.length && plantationsExtent.length) {
            data = {
              extent,
              plantations: plantationsExtent
            };
          }

          return data;
        })
      ),
  getWidgetProps
};
