import axios from 'axios';
import moment from 'moment';

import { getExtent, getLoss, getLossGrouped } from 'services/forest-data';
import { getForestTypes } from 'components/widgets/utils';

import getWidgetProps from './selectors';

export default {
  widget: 'treeLoss',
  title: 'Tree cover loss in {location}',
  categories: ['summary', 'forest-change'],
  types: ['country', 'geostore', 'wdpa', 'use', 'aoi'],
  admins: ['adm0', 'adm1', 'adm2'],
  large: true,
  analysis: true,
  chartType: 'composedChart',
  colors: 'loss',
  options: [
    {
      key: 'forestType',
      label: 'Forest Type',
      options: getForestTypes,
      type: 'selector'
    }
    // forestType: true,
    // landCategorie: true,
    // startYear: true,
    // endYear: true,
    // threshold: true,
    // extentYear: true
  ],
  refetchKeys: ['threshold', 'ifl', 'extentYear'],
  type: 'loss',
  metaKey: 'widget_tree_cover_loss',
  datasets: [
    {
      dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
      layers: [
        '6f6798e6-39ec-4163-979e-182a74ca65ee',
        'c5d1e010-383a-4713-9aaa-44f728c0571c'
      ],
      boundary: true
    },
    // loss
    {
      dataset: '897ecc76-2308-4c51-aeb3-495de0bdca79',
      layers: ['c3075c5a-5567-4b09-bc0d-96ed1673f8b6']
    }
  ],
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentence: {
    initial:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover, equivalent to a {percent} decrease since {extentYear}',
    withIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}, equivalent to a {percent} decrease since {extentYear}',
    noLoss:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover',
    noLossWithIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}',
    co2Emissions: 'and {emissions} of CO\u2082 emissions'
  },
  settings: {
    threshold: 30,
    startYear: 2001,
    endYear: 2018,
    extentYear: 2000,
    ifl: 2000
  },
  getData: ({ adm0, adm1, adm2, type, ...rest } = {}) => {
    const globalLocation = {
      adm0: type === 'global' ? null : adm0,
      adm1: type === 'global' ? null : adm1,
      adm2: type === 'global' ? null : adm2
    };
    const lossFetch =
      type === 'global'
        ? getLossGrouped({ ...rest, ...globalLocation })
        : getLoss({ ...rest, ...globalLocation });
    return axios.all([lossFetch, getExtent({ ...rest, ...globalLocation })]).then(
      axios.spread((loss, extent) => {
        let data = {};
        if (loss && loss.data && extent && extent.data) {
          data = {
            loss: loss.data.data,
            extent: (loss.data.data && extent.data.data[0].extent) || 0
          };
        }

        return data;
      })
    );
  },
  parseData: getWidgetProps,
  parseInteraction: payload => {
    const year = payload && payload[0].payload.year;
    return {
      updateLayer: true,
      startDate:
        year &&
        moment()
          .year(year)
          .startOf('year')
          .format('YYYY-MM-DD'),
      endDate:
        year &&
        moment()
          .year(year)
          .endOf('year')
          .format('YYYY-MM-DD')
    };
  }
};
