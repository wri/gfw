import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import maxBy from 'lodash/maxBy';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import { getColorPalette } from 'utils/data';

import {
  getMeansData,
  getStdDevData,
  getDatesData,
  getChartConfig,
} from 'components/widgets/utils/data';

const getAlerts = (state) => state.data && state.data.alerts;
const getLatest = (state) => state.data && state.data.latest;
const getColors = (state) => state.colors || null;
const getInteraction = (state) => state.settings.interaction || null;
const getWeeks = (state) => state.settings.weeks || null;
const getDataset = (state) => state.settings.dataset || null;
const getSentences = (state) => state.sentence || null;
const getLang = (state) => state.lang || null;

export const getData = createSelector(
  [getAlerts, getDataset],
  (data, dataset) => {
    if (!data || isEmpty(data)) return null;
    const dataMax = maxBy(data, 'year');
    const dataMaxYear = (dataMax && dataMax.year) || null;
    const dataMaxFiltered = maxBy(
      data.filter((el) => el && el.year === dataMaxYear),
      'week'
    );
    const dataMaxWeek = (dataMaxFiltered && dataMaxFiltered.week) || null;
    const groupedByYear = groupBy(data, 'year');
    const years = [];
    const lastWeek = {
      isoWeek: dataMaxWeek || moment().subtract(2, 'w').isoWeek(),
      year: dataMaxYear || moment().subtract(2, 'w').year(),
    };
    const minYear = dataset === 'MODIS' ? 2001 : 2016;
    for (let i = minYear; i <= lastWeek.year; i += 1) {
      years.push(i);
    }
    const yearLengths = {};
    years.forEach((y) => {
      if (lastWeek.year === parseInt(y, 10)) {
        yearLengths[y] = lastWeek.isoWeek;
      } else if (moment(`${y}-12-31`).weekday() === 1) {
        yearLengths[y] = moment(`${y}-12-30`).isoWeek();
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

export const getMeans = createSelector([getData], (data) => {
  if (!data) return null;
  return getMeansData(data, moment().subtract(2, 'w').format('YYYY-MM-DD'));
});

export const getStdDev = createSelector(
  [getMeans, getData],
  (data, rawData) => {
    if (!data) return null;
    return getStdDevData(data, rawData);
  }
);

export const getDates = createSelector([getStdDev], (data) => {
  if (!data) return null;
  return getDatesData(data);
});

export const parseData = createSelector([getDates, getWeeks], (data, weeks) => {
  if (!data) return null;
  return data.slice(-weeks);
});

export const parseConfig = createSelector(
  [getColors, getLatest],
  (colors, latest) => getChartConfig(colors, moment(latest))
);

export const parseSentence = createSelector(
  [parseData, getColors, getInteraction, getSentences, getDataset, getLang],
  (data, colors, interaction, sentence, dataset) => {
    if (!data) return null;
    let lastDate = data[data.length - 1] || {};
    if (!isEmpty(interaction)) {
      lastDate = interaction;
    }
    const colorRange = getColorPalette(colors.ramp, 5);
    let statusColor = colorRange[4];
    const {
      count,
      twoPlusStdDev,
      plusStdDev,
      minusStdDev,
      twoMinusStdDev,
      date,
    } = lastDate || {};

    let status = 'unusually low';
    if (twoPlusStdDev && count > twoPlusStdDev[1]) {
      status = 'unusually high';
      statusColor = colorRange?.[0];
    } else if (
      twoPlusStdDev &&
      count <= twoPlusStdDev[1] &&
      count > twoPlusStdDev[0]
    ) {
      status = 'high';
      statusColor = colorRange?.[1];
    } else if (
      plusStdDev &&
      minusStdDev &&
      count <= plusStdDev[1] &&
      count > minusStdDev[0]
    ) {
      status = 'average';
      statusColor = colorRange?.[2];
    } else if (
      twoMinusStdDev &&
      count >= twoMinusStdDev[0] &&
      count < twoMinusStdDev[1]
    ) {
      status = 'low';
      statusColor = colorRange?.[3];
    }
    const formattedData = moment(date).format('Do of MMMM YYYY');
    const params = {
      date: formattedData,
      dataset,
      count: {
        value: lastDate.count ? format(',')(lastDate.count) : 0,
        color: colors.main,
      },
      status: {
        value: status,
        color: statusColor,
      },
    };
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
});
