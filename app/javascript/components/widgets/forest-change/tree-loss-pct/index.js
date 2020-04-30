import { all, spread } from 'axios';

import { getExtent, getLoss, getLossGrouped } from 'services/analysis-cached';
import { getYearsRange } from 'components/widgets/utils/data';
import { fetchAnalysisEndpoint } from 'services/analysis';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';
import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_LOSS_DATASET
} from 'data/layers-datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_LOSS
} from 'data/layers';

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
      forestType: 'primary_forest',
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
  widget: 'treeLossPct',
  title: {
    default: 'Primary Forest loss in {location}',
    global: 'Global Primary Forest loss'
  },
  categories: ['summary', 'forest-change'],
  types: ['global', 'country', 'geostore', 'wdpa', 'use'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  large: true,
  visible: ['dashboard', 'analysis'],
  chartType: 'composedChart',
  colors: 'loss',
  settingsConfig: [
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true
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
  pendingKeys: ['threshold', 'years'],
  refetchKeys: ['landCategory', 'threshold'],
  dataType: 'loss',
  metaKey: 'widget_tree_cover_loss',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true
    },
    // loss
    {
      dataset: FOREST_LOSS_DATASET,
      layers: [FOREST_LOSS]
    }
  ],
  sortOrder: {
    summary: 0,
    forestChange: 0
  },
  sentence: {
    initial:
      'From {startYear} to {endYear}, {location} lost {loss} of humid primary forest, equivalent to a {percent} of {total tree cover loss} in the same time period. Total area of humid primary forest in {location} decreased by {extentDelta} in this time period.',
    withIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of humid primary forest in {indicator}, equivalent to a {percent} of {total tree cover loss} in the same time period. Total area of humid primary forest in {location} in {indicator} decreased by {extentDelta} in this time period.',
    globalInitial:
      'From {startYear} to {endYear}, there was a total of {loss} of humid primary forest lost {location}, equivalent to a {percent} of {total tree cover loss} in the same time period. Total area of humid primary forest decreased {location} by {extentDelta} in this time period.',
    globalWithIndicator:
      'From {startYear} to {endYear}, there was a total of {loss} of humid primary forest lost {location} within {indicator}, equivalent to a {percent} of {total tree cover loss} in the same time period. Total area of humid primary forest in {indicator} decreased {location} by {extentDelta} in this time period.',
    noLoss:
      'From {startYear} to {endYear}, {location} lost {loss} of humid primary forest.',
    noLossWithIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of humid primary forest in {indicator}.'
  },
  settings: {
    threshold: 30,
    extentYear: 2000
  },
  getData: (params = {}) => {
    const { adm0, adm1, adm2, type } = params || {};

    if (shouldQueryPrecomputedTables(params)) {
      const globalLocation = {
        adm0: type === 'global' ? null : adm0,
        adm1: type === 'global' ? null : adm1,
        adm2: type === 'global' ? null : adm2
      };

      return all([
        getLoss({ ...params, ...globalLocation }),
        getLoss({ ...params, ...globalLocation, forestType: 'primary_forest' }),
        getExtent({
          ...params,
          ...globalLocation,
          forestType: 'primary_forest'
        })
      ]).then(
        spread((loss, primaryLoss, extent) => {
          let data = {};
          if (
            primaryLoss &&
            primaryLoss.data &&
            loss &&
            loss.data &&
            extent &&
            extent.data
          ) {
            data = {
              loss: loss.data.data,
              primaryLoss: primaryLoss.data.data,
              extent: (loss.data.data && extent.data.data[0].extent) || 0
            };
          }

          const { startYear, endYear, range } = getYearsRange(
            data.loss.filter(d => d.year > 2001)
          );
          return {
            ...data,
            settings: {
              forestType: 'primary_forest',
              startYear,
              endYear
            },
            options: {
              years: range
            }
          };
        })
      );
    }

    return getDataAPI(params);
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
