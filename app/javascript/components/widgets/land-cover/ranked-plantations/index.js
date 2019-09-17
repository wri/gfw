import {
  getExtentGrouped,
  getAreaIntersectionGrouped
} from 'services/forest-data';
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
