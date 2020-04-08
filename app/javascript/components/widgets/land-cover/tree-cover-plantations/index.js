import { getExtent, getAreaIntersection } from 'services/analysis-cached';
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
  widget: 'treeCoverPlantations',
  title: 'Plantations in {location}',
  categories: ['land-cover'],
  types: ['country', 'geostore'],
  admins: ['adm0', 'adm1', 'adm2'],
  colors: 'plantations',
  chartType: 'pieChart',
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
  visible: ['dashboard', 'analysis'],
  metaKey: 'widget_plantation_extent',
  sortOrder: {
    landCover: 100
  },
  settings: {
    threshold: 10,
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
