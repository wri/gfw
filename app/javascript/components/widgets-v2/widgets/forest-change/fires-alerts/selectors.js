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

const getAlerts = state => state.data || null;
const getColors = state => state.colors || null;
const getActiveData = state => state.settings.activeData || null;
const getWeeks = state => state.settings.weeks || null;
const getDataset = state => state.settings.dataset || null;
const getSentences = state => state.config.sentence || null;

export const getData = createSelector(
  [getAlerts, getDataset],
  (data, dataset) => {
    if (!data || isEmpty(data)) return null;
    const groupedByYear = groupBy(data, 'year');
    const years = [];
    const latestFullWeek = moment().subtract(2, 'w');
    const lastWeek = {
      isoWeek: latestFullWeek.isoWeek(),
      year: latestFullWeek.year()
    };
    const min_year = dataset === 'MODIS' ? 2001 : 2016;
    for (let i = min_year; i <= lastWeek.year; i += 1) {
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

export const getMeans = createSelector([getData], data => {
  if (!data) return null;
  return getMeansData(
    data,
    moment()
      .subtract(2, 'w')
      .format('YYYY-MM-DD')
  );
});

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

export const parseData = createSelector([getDates, getWeeks], (data, weeks) => {
  if (!data) return null;
  return data.slice(-weeks);
});

export const parseConfig = createSelector([getColors], colors =>
  getChartConfig(
    colors,
    moment()
      .subtract(2, 'w')
      .format('YYYY-MM-DD')
  )
);

export const parseSentence = createSelector(
  [parseData, getColors, getActiveData, getSentences, getDataset],
  (data, colors, activeData, sentence, dataset) => {
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
      status = 'average';
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
      dataset,
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

export const parsePayload = payload => {
  const payloadData = payload && payload.find(p => p.name === 'count');
  const payloadValues = payloadData && payloadData.payload;
  if (payloadValues) {
    const startDate = moment()
      .year(payloadValues.year)
      .week(payloadValues.week);

    return {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: startDate.add(7, 'days'),
      ...payloadValues
    };
  }
  return {};
};

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence
});
