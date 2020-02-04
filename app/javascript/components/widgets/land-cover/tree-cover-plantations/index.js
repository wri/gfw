import { getExtent, getAreaIntersection } from 'services/forest-data-old';
import { all, spread } from 'axios';

import getWidgetProps from './selectors';

export default {
  widget: 'treeCoverPlantations',
  title: 'Plantations in {location}',
  categories: ['land-cover'],
  types: ['country', 'geostore'],
  admins: ['adm0', 'adm1', 'adm2'],
  colors: 'plantations',
  chartType: 'pieChart',
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
  visible: ['dashboard', 'analysis'],
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
    indicators: ['plantations'],
    checkStatus: true
  },
  getData: params =>
    all([
      getExtent(params),
      getAreaIntersection({ ...params, forestType: 'plantations' })
    ]).then(
      spread((gadmResponse, plantationsResponse) => {
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
  getDataURL: params => [
    getExtent({ ...params, download: true }),
    getAreaIntersection({
      ...params,
      forestType: 'plantations',
      download: true
    })
  ],
  getWidgetProps
};
