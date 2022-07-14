import { all, spread } from 'axios';

import { getExtent, getLossFires } from 'services/analysis-cached';

import OTFAnalysis from 'services/otf-analysis';

import { getYearsRangeFromMinMax } from 'components/widgets/utils/data';

import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';
import {
  POLITICAL_BOUNDARIES_DATASET,
  FOREST_LOSS_FIRES_DATASET,
} from 'data/datasets';
import {
  DISPUTED_POLITICAL_BOUNDARIES,
  POLITICAL_BOUNDARIES,
  FOREST_LOSS_FIRES,
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
      loss: loss.data.map((d) => ({
        area: d.area__ha,
        year: d.umd_tree_cover_loss__year,
      })),
      extent: extent?.data?.[0]?.area__ha,
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
  widget: 'treeLossFiresAnnual',
  title: 'Tree cover loss due to fires in {location}',
  categories: ['summary', 'fires'],
  types: ['country', 'geostore', 'aoi', 'wdpa', 'use'],
  // caution: {
  //   text:
  //     'The methods behind this data have changed over time. Be cautious comparing old and new data, especially before/after 2015. {Read more here}.',
  //   visible: ['country', 'geostore', 'aoi', 'wdpa', 'use'],
  //   linkText: 'Read more here',
  //   link:
  //     'https://www.globalforestwatch.org/blog/data-and-research/tree-cover-loss-satellite-data-trend-analysis/',
  // },
  admins: ['adm0', 'adm1', 'adm2'],
  large: true,
  visible: ['dashboard', 'analysis'],
  chartType: 'composedChart',
  colors: 'lossFires',
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest', 'plantations'],
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
      // blacklist: ['wdpa'],
    },
    // {
    //   key: 'extentYear',
    //   label: 'extent year',
    //   type: 'switch',
    // },
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
  // dataType: 'loss',
  metaKey: 'widget_tree_cover_loss_fires',
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // loss
    {
      dataset: FOREST_LOSS_FIRES_DATASET,
      layers: [FOREST_LOSS_FIRES],
    },
  ],
  sortOrder: {
    summary: 102,
    fires: 2,
  },
  sentence: {
    initial:
      'From {startYear} to {endYear}, {location} lost {treeCoverLossFires} of tree cover from fires and {treeCoverLossNotFires} from all other drivers of loss. The year with the most tree cover loss due to fires during this period was {highestYearFires} with {highestYearFiresLossFires} lost to fires — {highestYearFiresPercentageLossFires} of all tree cover loss for that year.',
    withIndicator:
      'From {startYear} to {endYear} in {indicator}, {location} lost {treeCoverLossFires} of tree cover from fires and {treeCoverLossNotFires} from all other drivers of loss. The year with the most tree cover loss due to fires during this period was {highestYearFires} with {highestYearFiresLossFires} lost to fires — {highestYearFiresPercentageLossFires} of all tree cover loss for that year.',
    noLoss:
      'From {startYear} to {endYear}, {location} lost {treeCoverLossFires} of tree cover due to fires.',
    noLossWithIndicator:
      'From {startYear} to {endYear} in {indicator}, {location} lost {treeCoverLossFires} of tree cover due to fires.',
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
      const lossFetch = getLossFires({ ...params, ...globalLocation });
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
      getLossFires({ ...params, ...globalLocation, download: true }),
      getExtent({ ...params, download: true }),
    ];
  },
  getWidgetProps,
};
