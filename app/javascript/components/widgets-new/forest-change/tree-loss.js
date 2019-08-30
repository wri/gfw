import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import moment from 'moment';
import { format } from 'd3-format';

import { formatNumber } from 'utils/format';
import { getExtent, getLoss, getLossGrouped } from 'services/forest-data';
import { yearTicksFormatter } from 'components/widgets/utils/data';

export default {
  widget: 'treeLoss',
  title: 'Tree cover loss in {location}',
  categories: ['summary', 'forest-change'],
  types: ['country', 'geostore', 'wdpa', 'use', 'aoi'],
  admins: ['adm0', 'adm1', 'adm2'],
  large: true,
  analysis: true,
  chartType: 'composedChart',
  options: {
    forestTypes: true,
    landCategories: true,
    startYears: true,
    endYears: true,
    thresholds: true,
    extentYears: true
  },
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
  getData: ({ params }) => {
    const { adm0, adm1, adm2, ...rest } = params || {};

    // if (params.type !== 'country' && params.type !== 'global') {
    //   return getDataAPI({ params });
    // }

    const globalLocation = {
      adm0: params.type === 'global' ? null : adm0,
      adm1: params.type === 'global' ? null : adm1,
      adm2: params.type === 'global' ? null : adm2
    };
    const lossFetch =
      params.type === 'global'
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
  parseData: ({ data, settings }) => {
    if (!data || isEmpty(data)) return null;
    const { startYear, endYear } = settings;
    return data.filter(d => d.year >= startYear && d.year <= endYear).map(d => {
      const percentageLoss = (d.area && d.area && d.area / extent * 100) || 0;

      return {
        ...d,
        area: d.area || 0,
        emissions: d.emissions || 0,
        percentage: percentageLoss > 100 ? 100 : percentageLoss
      };
    });
  },
  parseConfig: ({ colors }) => ({
    height: 250,
    xKey: 'year',
    yKeys: {
      bars: {
        area: {
          fill: colors.main,
          background: false
        }
      }
    },
    xAxis: {
      tickFormatter: yearTicksFormatter
    },
    unit: 'ha',
    tooltip: [
      {
        key: 'year'
      },
      {
        key: 'area',
        unit: 'ha',
        unitFormat: value =>
          (value < 1000 ? Math.round(value) : format('.3s')(value))
      },
      {
        key: 'percentage',
        unit: '%',
        unitFormat: value =>
          (value < 1000 ? Math.round(value) : format('.2r')(value))
      }
    ]
  }),
  parseSentence: ({ data, extent, settings, locationName, indicator, sentences, isTropical }) => {
    if (!data) return null;
    const {
      initial,
      withIndicator,
      noLoss,
      noLossWithIndicator,
      co2Emissions
    } = sentences;
    const { startYear, endYear, extentYear } = settings;
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && sumBy(data, 'emissions')) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;
    let sentence = indicator ? withIndicator : initial;
    if (totalLoss === 0) {
      sentence = indicator ? noLossWithIndicator : noLoss;
    }
    if (isTropical && totalLoss > 0) {
      sentence = `${sentence}, ${co2Emissions}`;
    }
    sentence = `${sentence}.`;

    const params = {
      indicator: indicator && indicator.label.toLowerCase(),
      location: locationName,
      startYear,
      endYear,
      loss: formatNumber({ num: totalLoss, unit: 'ha' }),
      percent: `${format('.2r')(percentageLoss)}%`,
      emissions: `${format('.3s')(totalEmissions)}t`,
      extentYear
    };

    return {
      sentence,
      params
    };
  },
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
