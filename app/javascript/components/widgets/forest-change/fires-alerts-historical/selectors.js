import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';

import { getDatesData, getChartConfig } from 'components/widgets/utils/data';

const getAlerts = state => state.data && state.data.alerts;
const getColors = state => state.colors || null;
const getStartYear = state => state.settings.startYear;
const getEndYear = state => state.settings.endYear;
const getSentences = state => state.sentence || null;
const getLocationObject = state => state.location;

export const getData = createSelector(
  [getAlerts, getStartYear, getEndYear],
  (data, startYear, endYear) => {
    if (!data || isEmpty(data)) return null;

    const years = [];

    for (let i = startYear; i <= endYear; i += 1) {
      years.push(i);
    }

    const yearLengths = {};
    years.forEach(y => {
      if (moment(`${y}-12-31`).isoWeek() === 1) {
        yearLengths[y] = moment(`${y}-12-31`)
          .subtract('week', 1)
          .isoWeek();
      } else {
        yearLengths[y] = moment(`${y}-12-31`).isoWeek();
      }
    });

    const zeroFilledData = [];
    if (startYear === endYear && !!data[0].alert__date) {
      // daily frequency
      // why check `alert__date`? Sometimes settings change before refetching,
      // and `data` is still the weekly data

      const dataWithYears = data
        .map(d => ({
          ...d,
          year: moment(d.alert__date).year(),
          week: moment(d.alert__date).isoWeek(),
          dayOfYear: moment(d.alert__date).dayOfYear() // zero-filling
        }))
        // optional, lightens data:
        .filter(d => d.year === startYear);

      const groupedByYear = groupBy(
        sortBy(dataWithYears, ['year', 'dayOfYear']),
        'year'
      );

      years.filter(year => year === startYear).forEach(year => {
        const yearDataByDay = groupBy(groupedByYear[year], 'dayOfYear');
        const maxDay =
          year === moment().year()
            ? Object.keys(yearDataByDay).pop()
            : moment(`${year}-12-31`).dayOfYear();
        for (let i = 1; i <= maxDay; i += 1) {
          zeroFilledData.push(
            yearDataByDay[i]
              ? yearDataByDay[i][0]
              : {
                alerts: 0,
                count: 0,
                week: moment()
                  .dayOfYear(i)
                  .isoWeek(),
                year: parseInt(year, 10)
              }
          );
        }
      });
    } else {
      // weekly frequency

      const groupedByYear = groupBy(sortBy(data, ['year', 'week']), 'year');

      years.forEach(year => {
        const yearDataByWeek = groupBy(groupedByYear[year], 'week');
        const maxWeek =
          year === moment().year()
            ? Object.keys(yearDataByWeek).pop()
            : yearLengths[year];
        for (let i = 1; i <= maxWeek; i += 1) {
          zeroFilledData.push(
            yearDataByWeek[i]
              ? yearDataByWeek[i][0]
              : { alerts: 0, count: 0, week: i, year: parseInt(year, 10) }
          );
        }
      });
    }

    return zeroFilledData;
  }
);

export const parseData = createSelector([getData], data => {
  if (!data) return null;
  // TODO: group by month if yearsRange > 7
  // getDatesData: adds date and month info to data array
  return getDatesData(data);
});

export const parseConfig = createSelector(
  [getColors, getStartYear, getEndYear],
  (colors, startYear, endYear) => ({
    ...getChartConfig(colors),
    xAxis: {
      tickCount: 12,
      interval: startYear === endYear ? 31 : undefined,
      tickFormatter: t => moment(t).format('MMM-YY')
    }
  })
);

export const parseSentence = createSelector(
  [
    parseData,
    getColors,
    getSentences,
    getLocationObject,
    getStartYear,
    getEndYear
  ],
  (data, colors, sentence, location, startYear, endYear) => {
    if (!data) return null;
    const lastDate = data[data.length - 1] || {};
    const firstDate = data[0] || {};
    const total = sumBy(
      data.filter(el => el.date >= firstDate.date && el.date <= lastDate.date),
      'count'
    );
    const params = {
      location: location.label || '',
      start_year: startYear,
      end_year: endYear,
      total_alerts: {
        value: total ? format(',')(total) : 0,
        color: colors.main
      }
    };
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence
});
