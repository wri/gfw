import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import { getColorPalette } from 'utils/data';

import {
  getMeansData,
  getStdDevData,
  getDatesData,
  getChartConfig
} from 'components/widgets-v2/utils/data';

const MIN_YEAR = 2015;

// get list data
const selectAlerts = state => (state.data && state.data.alerts) || null;
const selectLatestDates = state => (state.data && state.data.latest) || null;
const selectColors = state => state.colors || null;
const selectActiveData = state => state.settings.activeData || null;
const selectWeeks = state => (state.settings && state.settings.weeks) || null;
const selectSentence = state => state.config.sentence || null;

export const getData = createSelector(
  [selectAlerts, selectLatestDates],
  (data, latest) => {
    if (!data || isEmpty(data)) return null;
    const groupedByYear = groupBy(data, 'year');
    const years = [];
    const latestFullWeek = moment(latest).subtract(1, 'weeks');
    const lastWeek = {
      isoWeek: latestFullWeek.isoWeek(),
      year: latestFullWeek.year()
    };
    for (let i = MIN_YEAR; i <= lastWeek.year; i += 1) {
      years.push(i);
    }
    const yearLengths = {};
    years.forEach(y => {
      const lastIsoWeek =
        lastWeek.year !== parseInt(y, 10)
          ? moment(`${y}-12-31`).isoWeek()
          : lastWeek.isoWeek;
      yearLengths[y] = lastIsoWeek;
    });
    const zeroFilledData = [];
    years.forEach(d => {
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

export const getMeans = createSelector(
  [getData, selectLatestDates],
  (data, latest) => {
    if (!data) return null;
    return getMeansData(data, latest);
  }
);

export const getStdDev = createSelector(
  [getMeans, getData],
  (data, rawData) => {
    if (!data) return null;
    return getStdDevData(data, rawData);
  }
);

export const getDates = createSelector([getStdDev], data => {
  if (!data) return null;
  return getDatesData(data);
});

export const parseData = createSelector(
  [getDates, selectWeeks],
  (data, weeks) => {
    if (!data) return null;
    return data.slice(-weeks);
  }
);

export const parseConfig = createSelector(
  [selectColors, selectLatestDates],
  (colors, latest) => {
    if (!latest) return null;

    return getChartConfig(colors, latest);
  }
);

export const parseSentence = createSelector(
  [parseData, selectColors, selectActiveData, selectSentence],
  (data, colors, activeData, sentence) => {
    if (!data) return null;

    let lastDate = data[data.length - 1];
    if (!isEmpty(activeData)) {
      lastDate = activeData;
    }
    const colorRange = getColorPalette(colors.ramp, 5);
    let statusColor = colorRange[4];
    let status = 'unusually low';

    if (lastDate.count > lastDate.twoPlusStdDev[1]) {
      status = 'unusually high';
      statusColor = colorRange[0];
    } else if (
      lastDate.count <= lastDate.twoPlusStdDev[1] &&
      lastDate.count > lastDate.twoPlusStdDev[0]
    ) {
      status = 'high';
      statusColor = colorRange[1];
    } else if (
      lastDate.count <= lastDate.plusStdDev[1] &&
      lastDate.count > lastDate.minusStdDev[0]
    ) {
      status = 'normal';
      statusColor = colorRange[2];
    } else if (
      lastDate.count >= lastDate.twoMinusStdDev[0] &&
      lastDate.count < lastDate.twoMinusStdDev[1]
    ) {
      status = 'low';
      statusColor = colorRange[3];
    }
    const date = moment(lastDate.date).format('Do of MMMM YYYY');
    const params = {
      date,
      count: {
        value: format(',')(lastDate.count),
        color: colors.main
      },
      status: {
        value: status,
        color: statusColor
      }
    };
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence
});
