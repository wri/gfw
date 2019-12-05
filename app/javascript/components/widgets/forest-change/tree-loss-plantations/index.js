import axios from 'axios';
import { getLoss } from 'services/analysis-cached';

import getWidgetProps from './selectors';

export default {
  widget: 'treeLossPlantations',
  title: 'Forest loss in natural forest in {location}',
  large: true,
  categories: ['forest-change'],
  types: ['country', 'geostore'],
  admins: ['adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      options: [2013, 2014, 2015, 2016, 2017, 2018].map(y => ({
        label: y,
        value: y
      })),
      type: 'range-select',
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  refetchKeys: ['threshold'],
  chartType: 'composedChart',
  colors: 'loss',
  metaKey: 'widget_plantations_tree_cover_loss',
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
    },
    // loss
    {
      dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
      layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6']
    }
  ],
  sortOrder: {
    forestChange: 2
  },
  sentence:
    'From {startYear} to {endYear}, {percentage} of tree cover loss in {location} occurred within {lossPhrase}. The total loss within natural forest was equivalent to {value} of CO<sub>2</sub> emissions.',
  whitelists: {
    indicators: ['plantations'],
    checkStatus: true
  },
  settings: {
    threshold: 30,
    startYear: 2013,
    endYear: 2018,
    extentYear: 2010
  },
  getData: params =>
    axios
      .all([
        getLoss({ ...params, forestType: 'plantations' }),
        getLoss({ ...params, forestType: '' })
      ])
      .then(
        axios.spread((plantationsloss, gadmLoss) => {
          let data = {};
          const lossPlantations =
            plantationsloss.data && plantationsloss.data.data;
          const totalLoss = gadmLoss.data && gadmLoss.data.data;
          if (
            lossPlantations &&
            totalLoss &&
            lossPlantations.length &&
            totalLoss.length
          ) {
            data = {
              lossPlantations,
              totalLoss
            };
          }
          return data;
        })
      ),
  getWidgetProps
};
