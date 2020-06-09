import { all, spread } from 'axios';

import { getLossGrouped, getExtentGrouped } from 'services/analysis-cached';
import { getYearsRangeFromData } from 'components/widgets/utils/data';

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

export default {
  widget: 'treeLossRanked',
  title: {
    default: 'Tree cover loss in {location} compared to other areas',
    global: 'Global Tree cover loss'
  },
  categories: ['forest-change'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      whitelist: ['ifl', 'primary_forest'],
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
      key: 'unit',
      label: 'unit',
      whitelist: ['%', 'ha'],
      type: 'switch'
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
  chartType: 'lollipop',
  colors: 'loss',
  dataType: 'loss',
  metaKey: 'widget_tree_cover_loss_ranking',
  refetchKeys: ['threshold', 'extentYear', 'forestType', 'landCategory'],
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
    summary: 5,
    forestChange: 4
  },
  sentence: {
    globalInitial:
      'From {startYear} to {endYear}, {topLocationLabel} had the highest relative tree cover loss in the world, eqivalent to a loss of {topLocationLoss}, which represents {topLocationPerc} of the tree cover in the year {extentYear}.',
    globalWithIndicator:
      'From {startYear} to {endYear}, {topLocationLabel} within {indicator} had the highest relative tree cover loss in the world, eqivalent to a loss of {topLocationLoss}, which represents {topLocationPerc} of the tree cover in the year {extentYear}.',
    initial:
      'From {startYear} to {endYear}, {location} lost {loss} of relative tree cover, equivalent to a {localPercent} decrease since {extentYear} and {globalPercent} of the global total.',
    withIndicator:
      'From {startYear} to {endYear}, {location} lost {loss} of tree relative cover in {indicator}, equivalent to a {localPercent} decrease since {extentYear} and {globalPercent} of the global total.',
    noLoss: 'There was no relative tree cover loss identified in {location}.'
  },
  settings: {
    threshold: 30,
    unit: 'ha',
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

    return all([
      getLossGrouped({ ...rest, ...parentLocation }),
      getExtentGrouped({ ...rest, ...parentLocation })
    ]).then(
      spread((lossResponse, extentResponse) => {
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

        const { startYear, endYear, range } = getYearsRangeFromData(mappedData);
        return {
          loss: mappedData,
          extent: extentResponse.data.data,
          settings: {
            startYear,
            endYear,
            yearsRange: range
          },
          options: {
            years: range
          }
        };
      })
    );
  },
  getDataURL: params => {
    const { adm0, adm1, adm2, ...rest } = params || {};
    const parentLocation = {
      adm0: adm0 && !adm1 ? null : adm0,
      adm1: adm1 && !adm2 ? null : adm1,
      adm2: null
    };
    return [
      getLossGrouped({ ...rest, ...parentLocation, download: true }),
      getExtentGrouped({ ...rest, ...parentLocation, download: true })
    ];
  },
  getWidgetProps
};
