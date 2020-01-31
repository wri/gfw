import { all, spread } from 'axios';

import { getExtent, getLoss, getLossGrouped } from 'services/forest-data-old';
import { getYearsRange } from 'components/widgets/utils/data';
import { fetchAnalysisEndpoint } from 'services/analysis';

import getWidgetProps from './selectors';

const getGlobalLocation = params => ({
  adm0: params.type === 'global' ? null : params.adm0,
  adm1: params.type === 'global' ? null : params.adm1,
  adm2: params.type === 'global' ? null : params.adm2
});

export const getDataAPI = params =>
  fetchAnalysisEndpoint({
    ...params,
    name: 'umd',
    params,
    slug: 'umd-loss-gain',
    version: 'v1',
    aggregate: false
  }).then(response => {
    const { data } = (response && response.data) || {};
    const lossData = data && data.attributes.loss;
    const loss =
      lossData &&
      Object.keys(lossData).map(d => ({
        area: lossData[d],
        year: parseInt(d, 10)
      }));
    const extent = data.attributes.treeExtent;

    const { startYear, endYear, range } = getYearsRange(loss);

    return {
      loss,
      extent,
      settings: {
        startYear,
        endYear
      },
      options: {
        years: range
      }
    };
  });

export default {
  widget: 'treeLoss',
  title: 'Tree cover loss in {location}',
  categories: ['summary', 'forest-change'],
  types: ['country', 'geostore', 'wdpa', 'use'],
  admins: ['adm0', 'adm1', 'adm2'],
  large: true,
  visible: ['dashboard', 'analysis'],
  chartType: 'composedChart',
  colors: 'loss',
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest', 'mangroves_2016'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch'
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
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
  pendingKeys: ['threshold', 'years', 'extentYear'],
  refetchKeys: ['forestType', 'landCategory', 'threshold', 'ifl', 'extentYear'],
  dataType: 'loss',
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
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover, equivalent to a {percent} decrease in tree cover since {extentYear}',
    withIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}, equivalent to a {percent} decrease in tree cover since {extentYear}',
    noLoss:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover',
    noLossWithIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree cover in {indicator}',
    co2Emissions: 'and {emissions} of CO\u2082 emissions'
  },
  settings: {
    threshold: 30,
    extentYear: 2000,
    ifl: 2000
  },
  getData: (params = {}) => {
    const { adm0, adm1, adm2, type, status } = params || {};

    if (status === 'pending') {
      return getDataAPI(params);
    }

    const globalLocation = {
      adm0: type === 'global' ? null : adm0,
      adm1: type === 'global' ? null : adm1,
      adm2: type === 'global' ? null : adm2
    };
    const lossFetch =
      type === 'global'
        ? getLossGrouped({ ...params, ...globalLocation })
        : getLoss({ ...params, ...globalLocation });
    return all([lossFetch, getExtent({ ...params, ...globalLocation })]).then(
      spread((loss, extent) => {
        let data = {};
        if (loss && loss.data && extent && extent.data) {
          data = {
            loss: loss.data.data,
            extent: (loss.data.data && extent.data.data[0].extent) || 0
          };
        }

        const { startYear, endYear, range } = getYearsRange(data.loss);

        return {
          ...data,
          settings: {
            startYear,
            endYear
          },
          options: {
            years: range
          }
        };
      })
    );
  },
  getDataURL: params => {
    const globalLocation = getGlobalLocation(params);
    return [
      params.type === 'global'
        ? getLossGrouped({ ...params, ...globalLocation, download: true })
        : getLoss({ ...params, ...globalLocation, download: true }),
      getExtent({ ...params, download: true })
    ];
  },
  getWidgetProps,
  parseInteraction: (payload = {}) => {
    const { year } = payload;

    return {
      updateLayer: true,
      startYear: parseInt(year, 10),
      endYear: parseInt(year, 10)
    };
  }
};
