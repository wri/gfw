import { all, spread } from 'axios';

import { getLossGrouped, getExtentGrouped } from 'services/forest-data-old';
import { getYearsRange } from 'components/widgets/utils/data';

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
  chartType: 'rankedList',
  colors: 'loss',
  dataType: 'loss',
  metaKey: 'widget_tree_cover_loss_ranking',
  refetchKeys: ['threshold', 'extentYear', 'forestType', 'landCategory'],
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

        const { startYear, endYear, range } = getYearsRange(mappedData);
        return {
          loss: mappedData,
          extent: extentResponse.data.data,
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
