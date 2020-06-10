import { createSelector, createStructuredSelector } from 'reselect';
import moment from 'moment';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';

import { getDatesData, getChartConfig } from 'components/widgets/utils/data';

const getAlerts = state => state.data && state.data.alerts;
const getFrequency = state => state.data && state.data.frequency;
const getColors = state => state.colors || null;
const getStartDate = state => state.settings.startDate;
const getEndDate = state => state.settings.endDate;
const getSentences = state => state.sentences || null;
const getDataset = state => state.settings.dataset || null;
const getLocationObject = state => state.location;
const getOptionsSelected = state => state.optionsSelected;
const getIndicator = state => state.indicator;

const getDaysArray = (startDate, stopDate) => {
  const dateArray = [];
  let currentDate = moment(startDate);
  const endDate = moment(stopDate);
  while (currentDate <= endDate) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
};

export const getData = createSelector(
  [getAlerts, getFrequency, getStartDate, getEndDate],
  (data, frequency, startDate, endDate) => {
    if (!data || isEmpty(data) || !frequency || !startDate || !endDate) { return null; }

    const startYear = moment(startDate).year();
    const endYear = moment(endDate).year();
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
    if (frequency === 'daily') {
      // why check `alert__date`? Sometimes settings change before refetching,
      // and `data` is still the weekly data

      // If we are looking at daily resolution, add week and year and zero-fill
      const datesArray = getDaysArray(startDate, endDate);
      const dataWithYears = datesArray.map(d => {
        const filteredDate = data.find(el => el.alert__date === d);
        return {
          date: d,
          count:
            filteredDate && filteredDate.alert__count > 0
              ? filteredDate.alert__count
              : 0,
          year: moment(d).year(),
          week: moment(d).isoWeek(),
          dayOfYear: moment(d).dayOfYear() // zero-filling
        };
      });

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
  // getDatesData: adds date and month info to data array
  return getDatesData(data);
});

export const parseConfig = createSelector(
  [getColors, getFrequency, getDataset],
  (colors, frequency, dataset) => {
    const tooltip = [
      {
        label: 'Fire alerts'
      },
      {
        key: 'count',
        labelKey: 'date',
        labelFormat: value => moment(value).format('MMM DD YYYY'),
        unit: ` ${dataset.toUpperCase()} alerts`,
        color: colors.main,
        unitFormat: value =>
          (Number.isInteger(value) ? format(',')(value) : value)
      }
    ];

    return {
      ...getChartConfig(colors),
      tooltip,
      xAxis: {
        scale: 'point',
        tickCount: 12,
        interval: frequency === 'daily' ? 31 : undefined,
        tickFormatter: t => moment(t).format('MMM-YY')
      }
    };
  }
);

export const parseSentence = createSelector(
  [
    parseData,
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
    const { dataset, confidence } = options;
    const { initial, withInd, conf } = sentences;
    const lastDate = data[data.length - 1] || {};
    const firstDate = data[0] || {};
    const total = sumBy(
      data.filter(el => el.date >= firstDate.date && el.date <= lastDate.date),
      'count'
    );
    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;
    const initialSentence = indicator ? withInd : initial;
    const sentence =
      confidence.value === 'h' ? initialSentence + conf : `${initialSentence}.`;
    const params = {
      confidence: confidence.value === 'h' ? 'high confidence' : '',
      location: location.label || '',
      indicator: indicatorLabel,
      start_year: moment(startDate).format('Do of MMMM YYYY'),
      end_year: moment(endDate).format('Do of MMMM YYYY'),
      dataset: dataset && dataset.label,
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
