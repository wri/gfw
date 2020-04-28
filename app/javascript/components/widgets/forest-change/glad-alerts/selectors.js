import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { getColorPalette } from 'utils/data';

import {
  getMeansData,
  getStdDevData,
  getDatesData,
  getChartConfig
} from 'components/widgets/utils/data';

// get list data
const selectAlerts = state => state.data && state.data.alerts;
const selectLatestDates = state => state.data && state.data.latest;
const selectColors = state => state.colors;
const selectInteraction = state => state.settings.interaction;
const selectWeeks = state => state.settings && state.settings.weeks;
const selectSentences = state => state.sentence;
const selectLang = state => state.lang;
const getIndicator = state => state.indicator || null;

export const parsePayload = payload => {
  const payloadData = payload && payload.find(p => p.name === 'count');
  const payloadValues = payloadData && payloadData.payload;
  if (payloadValues) {
    return {
      startDate: payloadValues.date,
      endDate: moment(payloadValues.date)
        .add(7, 'days')
        .format('YYYY-MM-DD'),
      updateLayer: true,
      ...payloadValues
    };
  }
  return {};
};

export const getData = createSelector(
  [selectAlerts, selectLatestDates],
  (data, latest) => {
    if (!data || isEmpty(data)) return null;
    const groupedByYear = groupBy(sortBy(data, ['year', 'week']), 'year');
    const hasAlertsByYears = Object.values(groupedByYear).reduce(
      (acc, next) => {
        const { year } = next[0];
        return {
          ...acc,
          [year]: next.some(item => item.alerts > 0)
        };
      },
      {}
    );

    const dataYears = Object.keys(hasAlertsByYears).filter(
      key => hasAlertsByYears[key] === true
    );
    const minYear = Math.min(...dataYears.map(el => parseInt(el, 10)));
    const startYear =
      minYear === moment().year() ? moment().year() - 1 : minYear;

    const years = [];
    const latestWeek = moment(latest);
    const lastWeek = {
      isoWeek: latestWeek.isoWeek(),
      year: latestWeek.year()
    };

    for (let i = startYear; i <= lastWeek.year; i += 1) {
      years.push(i);
    }

    const yearLengths = {};
    years.forEach(y => {
      if (lastWeek.year === y) {
        yearLengths[y] = lastWeek.isoWeek;
      } else if (moment(`${y}-12-31`).isoWeek() === 1) {
        yearLengths[y] = moment(`${y}-12-31`)
          .subtract('week', 1)
          .isoWeek();
      } else {
        yearLengths[y] = moment(`${y}-12-31`).isoWeek();
      }
    });

    const zeroFilledData = [];

    years.forEach(d => {
      const yearDataByWeek = groupBy(groupedByYear[d], 'week');
      for (let i = 1; i <= yearLengths[d]; i += 1) {
        zeroFilledData.push(
          yearDataByWeek[i]
            ? yearDataByWeek[i][0]
            : { alerts: 0, count: 0, week: i, year: parseInt(d, 10) }
        );
      }
    });

    return zeroFilledData;
  }
);

export const getMeans = createSelector(
  [getData, selectLatestDates],
  (data, latest) => {
    if (!data || isEmpty(data)) return null;
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
  [parseData, selectColors, selectInteraction, selectSentences, getIndicator, selectLang],
  (data, colors, interaction, sentences, indicator) => {
    if (!data) return null;

    let lastDate = data[data.length - 1] || {};
    if (!isEmpty(interaction)) {
      lastDate = interaction;
    }
    const colorRange = getColorPalette(colors.ramp, 5);
    let statusColor = colorRange[4];
    let status = 'unusually low';

    const {
      count,
      twoPlusStdDev,
      plusStdDev,
      minusStdDev,
      twoMinusStdDev,
      date
    } =
      lastDate || {};

    if (twoPlusStdDev && count > twoPlusStdDev[1]) {
      status = 'unusually high';
      statusColor = colorRange[0];
    } else if (
      twoPlusStdDev &&
      count <= twoPlusStdDev[1] &&
      count > twoPlusStdDev[0]
    ) {
      status = 'high';
      statusColor = colorRange[1];
    } else if (
      plusStdDev &&
      minusStdDev &&
      count <= plusStdDev[1] &&
      count > minusStdDev[0]
    ) {
      status = 'normal';
      statusColor = colorRange[2];
    } else if (
      twoMinusStdDev &&
      count >= twoMinusStdDev[0] &&
      count < twoMinusStdDev[1]
    ) {
      status = 'low';
      statusColor = colorRange[3];
    }
    const formattedDate = moment(date).format('Do of MMMM YYYY');
    const params = {
      indicator: indicator && indicator.label,
      date: formattedDate,
      count: {
        value: lastDate.count ? format(',')(lastDate.count) : 0,
        color: colors.main
      },
      status: {
        value: status,
        color: statusColor
      }
    };
    return {
      sentence: indicator ? sentences.withInd : sentences.default,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence
});
