import { all, spread } from 'axios';

import { getExtent, getLoss, getLossGrouped } from 'services/analysis-cached';

import OTFAnalysis from 'services/otf-analysis';

import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';
import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_LOSS_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_LOSS,
} from 'data/layers';

import getWidgetProps from './selectors';

const MAX_YEAR = 2021;
const MIN_YEAR = 2001;

const getGlobalLocation = (params) => ({
  adm0: params.type === 'global' ? null : params.adm0,
  adm1: params.type === 'global' ? null : params.adm1,
  adm2: params.type === 'global' ? null : params.adm2,
});

const getOTFAnalysis = async (params) => {
  const analysis = new OTFAnalysis(params.geostore.id);
  analysis.setDates({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  analysis.setData(['loss', 'extent'], params);

  return analysis.getData().then((response) => {
    const { loss, extent } = response;
    const { startYear, endYear, range: yearsRange } = getYearsRangeFromMinMax(
      MIN_YEAR,
      MAX_YEAR
    );

    return {
      loss: loss.map((d) => ({
        area: d.area__ha,
        year: d.umd_tree_cover_loss__year,
      })),
      extent: extent?.[0]?.area__ha,
      settings: {
        startYear,
        endYear,
        yearsRange,
      },
      options: {
        yearsRange,
      },
    };
  });
};

export default {
  widget: 'treeLoss',
  title: 'Tree cover loss in {location}',
  categories: ['summary', 'forest-change'],
  subcategories: ['forest-loss'],
  types: ['country', 'geostore', 'aoi', 'wdpa', 'use'],
  caution: {
    text:
      'The methods behind this data have changed over time. Be cautious comparing old and new data, especially before/after 2015. {Read more here}.',
    visible: ['country', 'geostore', 'aoi', 'wdpa', 'use'],
    linkText: 'Read more here',
    link:
      'https://www.globalforestwatch.org/blog/data-and-research/tree-cover-loss-satellite-data-trend-analysis/',
  },
  admins: ['adm0', 'adm1', 'adm2'],
  large: true,
  visible: ['dashboard', 'analysis'],
  chartType: 'composedChart',
  colors: 'loss',
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'mangroves_2016'],
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'extentYear',
      label: 'extent year',
      type: 'switch',
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true,
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density',
    },
  ],
  pendingKeys: ['threshold', 'years', 'extentYear'],
  refetchKeys: ['forestType', 'landCategory', 'threshold', 'ifl', 'extentYear'],
  dataType: 'loss',
  metaKey: 'widget_tree_cover_loss',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // loss
    {
      dataset: FOREST_LOSS_DATASET,
      layers: [FOREST_LOSS],
    },
  ],
  sortOrder: {
    summary: 0,
    forestChange: 0,
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
    co2Emissions: 'and {emissions} of CO\u2082e emissions',
  },
  settings: {
    threshold: 30,
    extentYear: 2000,
    ifl: 2000,
  },
  getData: (params = {}) => {
    const { adm0, adm1, adm2, type } = params || {};

    if (shouldQueryPrecomputedTables(params)) {
      const globalLocation = {
        adm0: type === 'global' ? null : adm0,
        adm1: type === 'global' ? null : adm1,
        adm2: type === 'global' ? null : adm2,
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
              extent: (loss.data.data && extent.data.data) || 0,
            };
          }

          const { startYear, endYear, range } = getYearsRangeFromMinMax(
            MIN_YEAR,
            MAX_YEAR
          );
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
        })
      );
    }

    return getOTFAnalysis(params);
  },
  getDataURL: (params) => {
    const globalLocation = getGlobalLocation(params);
    return [
      params.type === 'global'
        ? getLossGrouped({ ...params, ...globalLocation, download: true })
        : getLoss({ ...params, ...globalLocation, download: true }),
      getExtent({ ...params, download: true }),
    ];
  },
  getWidgetProps,
};
