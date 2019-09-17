import { getExtent, getAreaIntersection } from 'services/forest-data';
import axios from 'axios';

import getWidgetProps from './selectors';

export default {
  widget: 'treeCoverPlantations',
  title: 'Plantations in {location}',
  categories: ['land-cover'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  colors: 'plantations',
  chartType: 'pieChart',
  datasets: [
    {
      // global plantations
      dataset: 'bb1dced4-3ae8-4908-9f36-6514ae69713f',
      layers: ['b8fb6cc8-6893-4ae0-8499-1ca9f1ababf4']
    }
  ],
  analysis: true,
  metaKey: 'widget_plantation_extent',
  sortOrder: {
    landCover: 100
  },
  settings: {
    threshold: 10,
    type: 'bound2',
    extentYear: 2010
  },
  sentences: {
    initialSpecies:
      'In {location}, {firstSpecies} and {secondSpecies} represent the largest plantation area by {type}, spanning {extent} and {percent} of land area.',
    singleSpecies:
      'In {location}, {firstSpecies} represent the largest plantation area by {type}, spanning {extent} and {percent} of land area.',
    initialTypes:
      'In {location}, the largest plantation area by type is {topType}, spanning {extent} and {percent} of land area.'
  },
  whitelists: {
    indicators: ['plantations']
  },
  getData: params =>
    axios
      .all([
        getExtent(params),
        getAreaIntersection({ ...params, forestType: 'plantations' })
      ])
      .then(
        axios.spread((gadmResponse, plantationsResponse) => {
          const gadmExtent = gadmResponse.data && gadmResponse.data.data;
          const plantationsExtent =
            plantationsResponse.data && plantationsResponse.data.data;
          let data = {};
          if (gadmExtent.length && plantationsExtent.length) {
            const totalArea = gadmExtent[0].total_area;
            const totalExtent = gadmExtent[0].extent;
            data = {
              totalArea,
              totalExtent,
              plantations: plantationsExtent
            };
          }

          return data;
        })
      ),
  getWidgetProps
};
