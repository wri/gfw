/* eslint-disable prefer-destructuring */
import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import max from 'lodash/max';
import min from 'lodash/min';

import { translateText } from 'utils/lang';
import { localizeWidgetSentenceDate } from 'utils/localize-date';

import {
  getStatsData,
  getDatesData,
  getPeriodVariance,
  getChartConfig,
} from 'components/widgets/utils/data';

const getAlerts = (state) => state.data && state.data.alerts;
const getLatest = (state) => state.data && state.data.latest;
const getColors = (state) => state.colors || null;
const getCompareYear = (state) => state.settings.compareYear || null;
const getDataset = (state) => state.settings.dataset || null;
const getStartIndex = (state) => state.settings.startIndex || 0;
const getEndIndex = (state) => state.settings.endIndex || null;
const getSentences = (state) => state.sentences || null;
const getLocationName = (state) => state.locationLabel;
const getLang = (state) => state.lang || null;
const getOptionsSelected = (state) => state.optionsSelected;
const getIndicator = (state) => state.indicator;
const getLanguage = (state) => state.lang;

const MINGAP = 4;

export const getData = createSelector(
  [getAlerts, getLatest],
  (data, latest) => {
    if (!data || isEmpty(data)) return null;
    const parsedData = data.map((d) => ({
      ...d,
      count: d.burn_area__ha,
      week: parseInt(d.alert__week, 10),
      year: parseInt(d.alert__year, 10),
    }));
    const groupedByYear = groupBy(sortBy(parsedData, ['year', 'week']), 'year');
    const hasAlertsByYears = Object.values(groupedByYear).reduce(
      (acc, next) => {
        const { year } = next[0];
        return {
          ...acc,
          [year]: next.some((item) => item.count > 0),
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
    const latestWeek = moment(latest);
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

export const getStats = createSelector([getData, getLatest], (data, latest) => {
  if (!data || isEmpty(data)) return null;
  return getStatsData(data, moment(latest).format('YYYY-MM-DD'));
});

export const getDates = createSelector([getStats], (data) => {
  if (!data || isEmpty(data)) return null;
  return getDatesData(data);
});

export const getMaxMinDates = createSelector(
  [getData, getDates],
  (data, currentData) => {
    if (!data || isEmpty(data) || !currentData || isEmpty(currentData))
      return {};
    const minYear = min(data.map((d) => d.year));
    const maxYear = max(data.map((d) => d.year));

    return {
      min: minYear,
      max: maxYear,
    };
  }
);

export const getStartEndIndexes = createSelector(
  [getStartIndex, getEndIndex, getDates],
  (startIndex, endIndex, currentData) => {
    if (!currentData || isEmpty(currentData)) {
      return {
        startIndex,
        endIndex,
      };
    }

    const start = startIndex;
    const end = endIndex || currentData.length - 1;

    return {
      startIndex: start,
      endIndex: end,
    };
  }
);

export const parseData = createSelector(
  [getData, getDates, getMaxMinDates, getCompareYear],
  (data, currentData, maxminYear, compareYear) => {
    if (!data || isEmpty(data) || !currentData || isEmpty(currentData))
      return null;

    // @TODO: better compare year parsing
    const { year: startYear, week: startWeek } = currentData[0];
    const yearDifference = maxminYear.max - startYear;

    const compareStartYear = compareYear - yearDifference;
    const weekFound = !!data.find(
      (el) => el.year === compareStartYear && el.week === startWeek
    );

    const findWeek = weekFound ? startWeek : 1;
    const findYear = weekFound ? compareStartYear : compareStartYear + 1;

    const compareStartIndex = data.findIndex(
      (el) => el.year === findYear && el.week === findWeek
    );

    const parsedData = currentData.map((d, i) => {
      if (compareYear) {
        const parsedCompareYear = compareYear - yearDifference;
        const compareWeek = data[compareStartIndex + i];
        return {
          ...d,
          compareYear: parsedCompareYear,
          compareCount: compareWeek ? compareWeek.count : null,
        };
      }

      return d;
    });
    return parsedData;
  }
);

export const parseBrushedData = createSelector(
  [parseData, getStartEndIndexes],
  (data, indexes) => {
    if (!data || isEmpty(data)) return null;

    const { startIndex, endIndex } = indexes;

    const start = startIndex || 0;
    const end = endIndex || data.length - 1;

    return data.slice(start, end + 1);
  }
);

export const getLegend = createSelector(
  [parseBrushedData, getColors, getCompareYear],
  (data, colors, compareYear) => {
    if (!data || isEmpty(data)) return {};

    const first = data[0];
    const end = data[data.length - 1];

    return {
      current: {
        label: `${moment(first.date).format('MMM YYYY')}–${moment(
          end.date
        ).format('MMM YYYY')}`,
        color: colors?.main,
      },
      ...(compareYear && {
        compare: {
          label: `${moment(first.date)
            .set('year', first.compareYear)
            .format('MMM YYYY')}–${moment(end.date)
            .set('year', end.compareYear)
            .format('MMM YYYY')}`,
          color: '#49b5e3',
        },
      }),
      average: {
        label: 'Normal Range',
        color: 'rgba(85,85,85, 0.15)',
      },
      unusual: {
        label: 'Above/Below Normal Range',
        color: 'rgba(85,85,85, 0.25)',
      },
    };
  }
);

export const parseConfig = createSelector(
  [
    getLegend,
    getColors,
    getLatest,
    getMaxMinDates,
    getCompareYear,
    getDataset,
    getStartEndIndexes,
  ],
  (legend, colors, latest, maxminYear, compareYear, dataset, indexes) => {
    const { startIndex, endIndex } = indexes;

    const tooltip = [
      {
        label: 'Burned area in the week of:',
      },
      {
        key: 'count',
        labelKey: 'date',
        labelFormat: (value) => moment(value).format('MMM DD YYYY'),
        unit: ` MODIS burned area`,
        color: colors?.main,
        unitFormat: (value) => `${format('.3s')(value)}ha`,
      },
    ];

    if (compareYear) {
      tooltip.push({
        key: 'compareCount',
        labelKey: 'date',
        labelFormat: (value) => {
          const date = moment(value);
          const yearDifference = maxminYear.max - date.year();
          date.set('year', compareYear - yearDifference);

          return date.format('MMM DD YYYY');
        },
        unit: ` MODIS burned area`,
        color: '#49b5e3',
        nullValue: 'No data available',
        unitFormat: (value) => `${format('.3s')(value)}ha`,
      });
    }

    return {
      ...getChartConfig(colors, moment(latest), {}, 'ha'),
      xAxis: {
        tickCount: 12,
        interval: 4,
        scale: 'point',
        tickFormatter: (t) => moment(t).format('MMM'),
        ...(typeof endIndex === 'number' &&
          typeof startIndex === 'number' &&
          endIndex - startIndex < 10 && {
            tickCount: 5,
            interval: 0,
            tickFormatter: (t) => moment(t).format('MMM-DD'),
          }),
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
          bottom: 12,
        },
        dataKey: 'date',
        startIndex,
        endIndex,
        minimumGap: MINGAP,
        maximumGap: 0,
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
    getData,
    parseData,
    getColors,
    getSentences,
    getDataset,
    getLocationName,
    getStartEndIndexes,
    getOptionsSelected,
    getLang,
    getIndicator,
    getLanguage,
  ],
  (
    raw_data,
    data,
    colors,
    sentences,
    dataset,
    location,
    indexes,
    options,
    lang,
    indicator,
    language
  ) => {
    if (!data || isEmpty(data)) return null;
    const {
      defaultSentence,
      seasonSentence,
      allBurn,
      allBurnWithInd,
      thresholdStatement,
    } = sentences;
    const thresh = options?.firesThreshold?.value;

    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;
    const { startIndex, endIndex } = indexes;
    const start = startIndex;
    const end = endIndex || data.length - 1;

    const lastDate = data[end] || {};
    const firstDate = data[start] || {};

    const slicedData = data.filter(
      (el) => el.date >= firstDate.date && el.date <= lastDate.date
    );
    const variance = getPeriodVariance(slicedData, raw_data);

    const maxMean = max(data.map((d) => d.mean));
    const minMean = min(data.map((d) => d.mean));
    const halfMax = (maxMean - minMean) * 0.5;

    const sortedWeeks = orderBy(data, 'date');

    const minWeeks = sortedWeeks.filter((d) => d.mean <= minMean);

    const earliestMinDate = minWeeks[0]?.date;
    const earliestMinIndex = sortedWeeks
      .map((el) => el.date)
      .indexOf(earliestMinDate);

    // Reorder the array so that we can ignore seasons that wrap around
    const firstHalf = sortedWeeks.slice(0, earliestMinIndex);
    const secondHalf = sortedWeeks.slice(earliestMinIndex);
    const reorderedWeeks = secondHalf.concat(firstHalf);

    const sortedPeakWeeks = reorderedWeeks.filter((d) => d.mean > halfMax);

    const seasonStartDate =
      sortedPeakWeeks.length > 0 && sortedPeakWeeks[0]?.date;

    const seasonMonth = moment(seasonStartDate).format('MMMM');
    const seasonDay = parseInt(moment(seasonStartDate).format('D'), 10);

    let seasonStatement = translateText('late {seasonMonth}', { seasonMonth });
    if (seasonDay <= 10) {
      seasonStatement = translateText('early {seasonMonth}', { seasonMonth });
    } else if (seasonDay > 10 && seasonDay <= 20) {
      seasonStatement = translateText('mid-{seasonMonth}', { seasonMonth });
    }

    const total = sumBy(slicedData, 'count');
    const colorRange = colors.ramp;
    let statusColor = colorRange[8];
    const { date } = lastDate || {};

    let status = translateText('unusually low');
    if (variance > 2) {
      status = translateText('unusually high');
      statusColor = colorRange[0];
    } else if (variance <= 2 && variance > 1) {
      status = translateText('high');
      statusColor = colorRange[2];
    } else if (variance <= 1 && variance > -1) {
      status = translateText('normal');
      statusColor = colorRange[4];
    } else if (variance <= -1 && variance > -2) {
      status = translateText('low');
      statusColor = colorRange[6];
    }

    const initialSentence = seasonStartDate ? seasonSentence : defaultSentence;

    let sentence = indicator
      ? initialSentence + allBurnWithInd
      : initialSentence + allBurn;

    sentence =
      thresh && thresh > 0
        ? sentence + thresholdStatement
        : sentence.concat('.');

    const params = {
      location,
      indicator: indicatorLabel,
      thresh: `${thresh}%`,
      date: localizeWidgetSentenceDate(date, language),
      fires_season_start: seasonStatement,
      fire_season_length: sortedPeakWeeks.length,
      start_date: localizeWidgetSentenceDate(firstDate.date, language),
      end_date: localizeWidgetSentenceDate(lastDate.date, language),
      dataset_start_year: 2001,
      dataset: 'MODIS',
      area: {
        value: total ? `${format('.2s')(total)}ha` : '0 ha',
        color: colors.main,
      },
      status: {
        value: status,
        color: statusColor,
      },
      lang,
    };
    return { sentence, params };
  }
);

export default createStructuredSelector({
  originalData: parseData,
  data: parseBrushedData,
  config: parseConfig,
  sentence: parseSentence,
});
