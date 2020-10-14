import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import max from 'lodash/max';
import min from 'lodash/min';

import {
  getStatsData,
  getDatesData,
  getChartConfig
} from 'components/widgets/utils/data';

const getAlerts = state => state.data;
const getColors = state => state.colors || null;
const getStartDate = state => state.settings.startDate;
const getLatest = state => state.data && state.data.latest;
const getCompareYear = state => state.settings.compareYear || null;
const getDataset = state => state.settings.dataset || null;
const getEndDate = state => state.settings.endDate;
const getSentences = state => state.sentences || null;
const getLocationObject = state => state.location;
const getOptionsSelected = state => ({
  dataset: state.dataType
});
const getIndicator = state => state.location;
const getStartIndex = state => state.settings.startIndex;
const getEndIndex = state => state.settings.endIndex || null;

const zeroFillDays = (startDate, endDate) => {
  const start = moment(startDate);
  const diffInDays = moment(endDate).diff(moment(startDate), 'days');
  const dates = Array.from(Array(diffInDays).keys());

  return [
    startDate,
    ...dates.map(() => start.add(1, 'days').format('YYYY-MM-DD'))
  ];
};

export const getData = createSelector(
  [getAlerts, getStartDate, getEndDate],
  (data, startDate, endDate) => {
    if (!data || isEmpty(data)) return null;
    const zeroFilledData = zeroFillDays(startDate, endDate).map(date => ({
      date,
      alert__count: 0,
      year: moment(date).year(),
      week: moment(date).week(),
      count: 0,
      ...data.data.find(d => d.alert__date === date)
    }));
    const d = sortBy(zeroFilledData, 'date');
    return d;
  }
);

export const getStats = createSelector([getData, getLatest], (data, latest) => {
  if (!data) return null;
  return getStatsData(data, moment(latest).format('YYYY-MM-DD'));
});


export const getDates = createSelector([getStats], data => {
  if (!data) return null;
  return getDatesData(data);
});

export const getMaxMinDates = createSelector(
  [getData, getDates],
  (data, currentData) => {
    if (!data || !currentData) return {};
    const minYear = min(data.map(d => d.year));
    const maxYear = max(data.map(d => d.year));

    return {
      min: minYear,
      max: maxYear
    };
  }
);

export const parseData = createSelector(
  [getData, getDates, getMaxMinDates, getCompareYear],
  (data, currentData, maxminYear, compareYear) => {
    if (!data || !currentData) return null;

    return currentData.map(d => {
      const yearDifference = maxminYear.max - d.year;
      const { week } = d;

      if (compareYear) {
        const parsedCompareYear = compareYear - yearDifference;

        const compareWeek = data.find(
          dt => dt.year === parsedCompareYear && dt.week === week
        );

        return {
          ...d,
          compareYear: parsedCompareYear,
          compareCount: compareWeek ? compareWeek.count : null
        };
      }

      return d;
    });
  }
);

export const getStartEndIndexes = createSelector(
  [getStartIndex, getEndIndex, getDates],
  (startIndex, endIndex, currentData) => {
    if (!currentData) {
      return {
        startIndex,
        endIndex
      };
    }
    const start =
      startIndex || startIndex === 0 ? startIndex : currentData.length - 365;

    const end = endIndex || currentData.length - 1;
    return {
      startIndex: start,
      endIndex: end
    };
  }
);

export const parseBrushedData = createSelector(
  [parseData, getStartEndIndexes],
  (data, indexes) => {
    if (!data) return null;

    const { startIndex, endIndex } = indexes;

    const start = startIndex || 0;
    const end = endIndex || data.length - 1;
    const d = data.slice(start, end + 1);
    return d;
  }
);

export const getLegend = createSelector(
  [parseBrushedData, getColors, getCompareYear],
  (data, colors, compareYear) => {
    if (!data) return {};

    const first = data[0];
    const end = data[data.length - 1];

    return {
      current: {
        label: `${moment(first.date).format('MMM DD')} – ${moment(
          end.date
        ).format('MMM DD')}`,
        color: colors.main
      },
      ...(compareYear && {
        compare: {
          label: `${moment(first.date)
            .set('year', first.compareYear)
            .format('MMM DD')}–${moment(end.date)
            .set('year', end.compareYear)
            .format('MMM DD')}`,
          color: '#49b5e3'
        }
      }),
      average: {
        label: 'Normal Range',
        color: 'rgba(85,85,85, 0.15)'
      },
      unusual: {
        label: 'Above/Below Normal Range',
        color: 'rgba(85,85,85, 0.25)'
      }
    };
  }
);

export const parseConfig = createSelector(
  [getLegend, getColors, getLatest, getMaxMinDates, getCompareYear, getDataset, getStartEndIndexes],
  (legend, colors, latest, maxminYear, compareYear, dataset, indexes) => {
    const { startIndex, endIndex } = indexes;
    const tooltip = [
      {
        label: 'Glad alerts'
      },
      {
        key: 'count',
        labelKey: 'date',
        labelFormat: value => moment(value).format('MMM DD YYYY'),
        unit: ' GLAD alerts',
        color: colors.main,
        unitFormat: value =>
          (Number.isInteger(value) ? format(',')(value) : value)
      }
    ];

    if (compareYear) {
      tooltip.push({
        key: 'compareCount',
        labelKey: 'date',
        labelFormat: value => {
          const date = moment(value);
          const yearDifference = maxminYear.max - date.year();
          date.set('year', compareYear - yearDifference);

          return date.format('MMM DD YYYY');
        },
        unit: ` ${dataset.toUpperCase()} alerts`,
        color: '#49b5e3',
        nullValue: 'No data available',
        unitFormat: value =>
          (Number.isInteger(value) ? format(',')(value) : value)
      });
    }

    return {
      ...getChartConfig(colors, moment(latest)),
      xAxis: {
        tickCount: 12,
        interval: 4,
        scale: 'point',
        tickFormatter: t => moment(t).format('MMM'),
        ...(typeof endIndex === 'number' &&
          typeof startIndex === 'number' &&
          endIndex - startIndex < 10 && {
          tickCount: 5,
          interval: 0,
          tickFormatter: t => moment(t).format('MMM-DD')
        })
      },
      legend,
      tooltip,
      brush: {
        width: '100%',
        height: 60,
        margin: {
          top: 0,
          right: 10,
          left: 48,
          bottom: 12
        },
        minimumGap: 30,
        maximumGap: 0,
        dataKey: 'date',
        startIndex: startIndex || 0,
        endIndex,
        config: {
          margin: {
            top: 5,
            right: 0,
            left: 42,
            bottom: 20
          },
          yKeys: {
            lines: {
              count: {
                stroke: colors.main,
                isAnimationActive: false
              },
              compareCount: {
                stroke: '#49b5e3',
                isAnimationActive: false
              }
            }
          },
          xAxis: {
            hide: true,
            scale: 'point'
          },
          yAxis: {
            hide: true
          },
          cartesianGrid: {
            horizontal: false,
            vertical: false
          },
          height: 60
        }
      }
    };
  }
);

export const parseSentence = createSelector(
  [
    getData,
    getColors,
    getSentences,
    getLocationObject,
    getStartDate,
    getEndDate,
    getOptionsSelected,
    getIndicator
  ],
  (
    data,
    colors,
    sentences,
    location,
    startDate,
    endDate,
    options,
    indicator
  ) => {
    if (!data) return null;
    const { initial, withInd, highConfidence } = sentences;
    const { confidence, dataset } = options;
    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;
    const total = sumBy(data, 'alert__count');
    let sentence = indicator ? withInd : initial;
    sentence =
      confidence && confidence.value === 'h'
        ? sentence + highConfidence
        : `${sentence}.`;

    const params = {
      location: location.label || '',
      indicator: indicatorLabel,
      start_date: moment(startDate).format('Do of MMMM YYYY'),
      end_date: moment(endDate).format('Do of MMMM YYYY'),
      dataset: dataset || null,
      total_alerts: {
        value: total ? format(',')(total) : 0,
        color: colors.main
      }
    };

    return { sentence, params };
  }
);

export default createStructuredSelector({
  originalData: parseData,
  data: parseBrushedData,
  config: parseConfig,
  sentence: parseSentence
});
