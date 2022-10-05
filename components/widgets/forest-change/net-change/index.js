import { getNetChange } from 'services/analysis-cached';

import { getYearsRangeFromData } from 'components/widgets/utils/data';

import {
  POLITICAL_BOUNDARIES_DATASET,
  NET_CHANGE_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  NET_CHANGE,
} from 'data/layers';

import getWidgetProps from './selectors';

const getGlobalLocation = (params) => ({
  adm0: params.type === 'global' ? null : params.adm0,
  adm1: params.type === 'global' ? null : params.adm1,
  adm2: params.type === 'global' ? null : params.adm2,
});

export default {
  widget: 'netChange',
  title: {
    default: 'Components of net change in tree cover in {location}',
    global: 'Components of net change in tree cover globally',
  },
  categories: ['summary', 'forest-change'],
  types: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  // caution: {
  //   text:
  //     'The methods behind this data have changed over time. Be cautious comparing old and new data, especially before/after 2015. {Read more here}.',
  //   visible: ['country', 'geostore', 'aoi', 'wdpa', 'use'],
  //   linkText: 'Read more here',
  //   link:
  //     'https://www.globalforestwatch.org/blog/data-and-research/tree-cover-loss-satellite-data-trend-analysis/',
  // },
  large: false,
  visible: ['dashboard', 'analysis'],
  chartType: 'pieChart',
  colors: 'netChange',
  dataType: 'netChange',
  metaKey: 'umd_tree_cover_loss_from_fires',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    {
      dataset: NET_CHANGE_DATASET,
      layers: [NET_CHANGE],
    },
  ],
  sortOrder: {
    summary: 102,
    fires: 10,
  },
  sentence: {
    globalInitial:
      'From 2000 to 2020, the world experienced a {netChangePerc} change in tree cover.',
    initial:
      'From 2000 to 2020, {location} experienced a net change of {netChange} ({netChangePerc}) change in tree cover.',
    // noLoss:
    //   'Fires were responsible for {lossFiresPercentage} of tree cover loss in {location} between {startYear} and {endYear}.',
  },
  getData: (params = {}) => {
    const { adm0, adm1, adm2, type } = params || {};

    const globalLocation = {
      adm0: type === 'global' ? null : adm0,
      adm1: type === 'global' ? null : adm1,
      adm2: type === 'global' ? null : adm2,
    };

    const netChangeFetch = getNetChange({ ...params, ...globalLocation });

    return netChangeFetch.then((netChange) => {
      let data = {};
      if (netChange && netChange.data) {
        data = {
          netChange: netChange.data.data,
        };
      }

      const { startYear, endYear, range } =
        (data.netChange && getYearsRangeFromData(data.netChange)) || {};

      return {
        ...data,
        settings: {
          startYear,
          endYear,
          yearsRange: range,
        },
        options: {
          years: range,
        },
      };
    });
  },
  getDataURL: (params) => {
    const globalLocation = getGlobalLocation(params);
    return [getNetChange({ ...params, ...globalLocation, download: true})];
  },
  getWidgetProps,
};
