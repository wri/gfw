import axios from 'axios';

import { getLossGrouped, getExtentGrouped } from 'services/forest-data';

import getWidgetProps from './selectors';

export default {
  widget: 'treeLossRanked',
  title: {
    default: 'Tree cover loss in {location} compared to other areas',
    global: 'Global Tree cover loss'
  },
  categories: ['forest-change'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  // options: {
  //   forestTypes: ['ifl', 'primary_forest'],
  //   landCategories: true,
  //   units: ['ha', '%'],
  //   thresholds: true,
  //   extentYears: true,
  //   startYears: true,
  //   endYears: true
  // },
  chartType: 'rankedList',
  colors: 'loss',
  dataType: 'loss',
  metaKey: 'widget_tree_cover_loss_ranking',
  datasets: [
    // loss
    {
      dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
      layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6']
    }
  ],
  sortOrder: {
    summary: 5,
    forestChange: 4
  },
  sentence: {
    globalInitial:
      'From {startYear} to {endYear}, {loss} of tree cover was lost {location}, equivalent to a {localPercent} decrease since {extentYear}.',
    globalWithIndicator:
      'From {startYear} to {endYear}, {loss} of tree cover was lost {location}, within {indicator} equivalent to a {localPercent} decrease since {extentYear}',
    initial:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover, equivalent to a {localPercent} decrease since {extentYear} and {globalPercent} of the global total.',
    withIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}, equivalent to a {localPercent} decrease since {extentYear} and {globalPercent} of the global total.',
    noLoss: 'There was no tree cover loss identified in {location}.'
  },
  settings: {
    threshold: 30,
    startYear: 2001,
    endYear: 2018,
    unit: '%',
    extentYear: 2000,
    pageSize: 5,
    page: 0,
    ifl: 2000
  },
  getData: ({ adm0, adm1, adm2, ...rest } = {}) => {
    const parentLocation = {
      adm0: adm0 && !adm1 ? null : adm0,
      adm1: adm1 && !adm2 ? null : adm1,
      adm2: null
    };

    return axios
      .all([
        getLossGrouped({ ...rest, ...parentLocation }),
        getExtentGrouped({ ...rest, ...parentLocation })
      ])
      .then(
        axios.spread((lossResponse, extentResponse) => {
          const { data } = lossResponse.data;
          let mappedData = [];
          if (data && data.length) {
            mappedData = data.map(item => {
              const loss = item.area || 0;
              return {
                ...item,
                loss
              };
            });
          }
          return {
            loss: mappedData,
            extent: extentResponse.data.data
          };
        })
      );
  },
  getWidgetProps
};
