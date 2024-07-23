import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import { formatNumber } from 'utils/format';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';

import { localizeWidgetSentenceDate } from 'utils/localize-date';

import { getChartConfig, getDatesData } from 'components/widgets/utils/data';

const getAlerts = (state) => state.data && state.data.alerts;
const getColors = (state) => state.colors || null;
const getEndDate = (state) => state.settings.endDate;
const getSentences = (state) => state.sentences || null;
const getLocationObject = (state) => state.location;
const getOptionsSelected = (state) => state.optionsSelected;
const getIndicator = (state) => state.indicator;
const getStartIndex = (state) => state.settings.startIndex;
const getEndIndex = (state) => state.settings.endIndex || null;
const getLanguage = (state) => state.lang;

const INITIAL_WINDOW_WEEKS = 3 * 52 + 1;

export const getZeroFilledData = createSelector(
  [getAlerts, getEndDate],
  (data, endDate) => {
    if (!data || isEmpty(data)) return null;
    const parsedData = data.map((d) => ({
      ...d,
      count: d.alert__count,
      week: parseInt(d.alert__week, 10),
      year: parseInt(d.alert__year, 10),
    }));
    const groupedByYear = groupBy(sortBy(parsedData, ['year', 'week']), 'year');
    const hasAlertsByYears = Object.values(groupedByYear).reduce(
      (acc, next) => {
        const { year } = next[0];
        return {
          ...acc,
          [year]: next.some((item) => item.alerts > 0),
        };
      },
      {}
    );

    const dataYears = Object.keys(hasAlertsByYears).filter(
      (key) => hasAlertsByYears[key] === true
    );
    const minYear = Math.min(...dataYears.map((el) => parseInt(el, 10)));
    const startYear =
      minYear === moment().year() ? moment().year() - 1 : minYear;

    const years = [];
    const latestWeek = moment(endDate);
    const lastWeek = {
      isoWeek: latestWeek.isoWeek(),
      year: latestWeek.year(),
    };

    for (let i = startYear; i <= lastWeek.year; i += 1) {
      years.push(i);
    }

    const yearLengths = {};
    years.forEach((y) => {
      if (lastWeek.year === y) {
        yearLengths[y] = lastWeek.isoWeek;
      } else if (moment(`${y}-12-31`).isoWeek() === 1) {
        yearLengths[y] = moment(`${y}-12-31`).subtract(1, 'week').isoWeek();
      } else {
        yearLengths[y] = moment(`${y}-12-31`).isoWeek();
      }
    });

    const zeroFilledData = [];

    years.forEach((d) => {
      const yearDataByWeek = groupBy(groupedByYear[d], 'week');
      for (let i = 1; i <= yearLengths[d]; i += 1) {
        zeroFilledData.push(
          yearDataByWeek[i]
            ? yearDataByWeek[i][0]
            : { count: 0, week: i, year: parseInt(d, 10) }
        );
      }
    });
    return zeroFilledData;
  }
);

export const getData = createSelector([getZeroFilledData], (data) => {
  if (!data || isEmpty(data)) return null;
  const zeroFilledData = data.map((date) => ({
    alert__count: 0,
    count: 0,
    ...date,
    ...data.find((d) => d.alert__date === date),
    date: null,
  }));
  const zeroFilledDates = getDatesData(zeroFilledData);
  return sortBy(zeroFilledDates, 'date');
});

export const getStartEndIndexes = createSelector(
  [getStartIndex, getEndIndex, getData],
  (startIndex, endIndex, currentData) => {
    if (!currentData) {
      return {
        startIndex,
        endIndex,
      };
    }
    const start =
      startIndex || startIndex === 0
        ? startIndex
        : currentData.length - INITIAL_WINDOW_WEEKS;
    const end = endIndex || currentData.length - 1;

    return {
      startIndex: start,
      endIndex: end,
    };
  }
);

export const parseBrushedData = createSelector(
  [getData, getStartEndIndexes],
  (data, indexes) => {
    if (!data) return null;
    const { startIndex, endIndex } = indexes;

    const start = startIndex || 0;
    const end = endIndex || data.length - 1;

    return data.slice(start, end + 1);
  }
);

export const parseConfig = createSelector(
  [getColors, getStartEndIndexes],
  (colors, indexes) => {
    const { startIndex, endIndex } = indexes;

    const tooltip = [
      {
        label: 'Fire alerts',
      },
      {
        key: 'count',
        labelKey: 'date',
        labelFormat: (value) => moment(value).format('MMM DD YYYY'),
        unit: ' VIIRS alerts',
        color: colors.main,
        unitFormat: (value) =>
          Number.isInteger(value)
            ? formatNumber({ num: value, unit: ',' })
            : value,
      },
    ];

    return {
      ...getChartConfig(colors),
      tooltip,
      xAxis: {
        tickFormatter: (t) => moment(t).format("MMM DD, 'YY"),
      },
      unit: ' weekly alerts',
      brush: {
        width: '100%',
        height: 60,
        margin: {
          top: 0,
          right: 10,
          left: 48,
          bottom: 12,
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
            bottom: 20,
          },
          yKeys: {
            lines: {
              count: {
                stroke: colors.main,
                isAnimationActive: false,
              },
              compareCount: {
                stroke: '#49b5e3',
                isAnimationActive: false,
              },
            },
          },
          xAxis: {
            hide: true,
            scale: 'point',
          },
          yAxis: {
            hide: true,
          },
          cartesianGrid: {
            horizontal: false,
            vertical: false,
          },
          height: 60,
        },
      },
    };
  }
);

export const parseSentence = createSelector(
  [
    parseBrushedData,
    getColors,
    getSentences,
    getLocationObject,
    getOptionsSelected,
    getIndicator,
    getLanguage,
  ],
  (data, colors, sentences, location, options, indicator, language) => {
    if (!data || !data.length) return null;
    const { initial, withInd, highConfidence } = sentences;
    const { confidence, dataset } = options;
    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;

    const startDate = data[0].date;
    const endDate = data[data.length - 1].date;
    const total = sumBy(data, 'alert__count');

    let sentence = indicator ? withInd : initial;
    sentence =
      confidence && confidence.value === 'h'
        ? sentence + highConfidence
        : `${sentence}.`;

    const params = {
      location: location.label || '',
      indicator: indicatorLabel,
      start_date: localizeWidgetSentenceDate(startDate, language),
      end_date: localizeWidgetSentenceDate(endDate, language),
      dataset: dataset && dataset.label,
      total_alerts: {
        value: total ? formatNumber({ num: total, unit: ',' }) : 0,
        color: colors.main,
      },
    };
    return { sentence, params };
  }
);

export default createStructuredSelector({
  originalData: getData,
  data: parseBrushedData,
  config: parseConfig,
  sentence: parseSentence,
});
