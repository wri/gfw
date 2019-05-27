import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';
import groupBy from 'lodash/groupBy';
import range from 'lodash/range';
import moment from 'moment';

import { getDatesData, getChartConfig } from 'components/widgets/utils/data';

const getAlerts = state => (state.data && state.data.data) || null;
const getColors = state => state.colors || null;
const getActiveData = state => state.settings.activeData || null;
const getSentences = state => state.config.sentences || null;
const getSettings = state => state.settings;

const getDataSettings = state => state.data && state.data.settings;
export const getDataOptions = state => state.data && state.data.options;

const TARGET_EMISSIONS = 265000000;
const TARGET_DEFORESTATION = 988880;

export const getData = createSelector(
  [getAlerts, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;

    const { variable } = settings;
    const target =
      variable === 'cumulative_emissions'
        ? TARGET_EMISSIONS
        : TARGET_DEFORESTATION;

    const groupedByYear = Object.entries(data).reduce(
      (acc, [y, arr]) => ({
        ...acc,
        [y]: arr.map(d => ({
          ...d,
          count:
            variable === 'cumulative_emissions'
              ? d[variable] * 1000000
              : d[variable],
          year: y,
          target
        }))
      }),
      {}
    );

    const latestFullWeek = moment().subtract(2, 'w');
    const lastWeek = {
      isoWeek: latestFullWeek.isoWeek(),
      year: latestFullWeek.year()
    };

    const years = range(2015, lastWeek.year);
    const yearLengths = {};

    years.forEach(y => {
      if (lastWeek.year === parseInt(y, 10)) {
        yearLengths[y] = lastWeek.isoWeek;
      } else if (moment(`${y}-12-31`).weekday() === 1) {
        yearLengths[y] = moment(`${y}-12-30`).isoWeek();
      } else {
        yearLengths[y] = moment(`${y}-12-31`).isoWeek();
      }
    });

    return Object.entries(groupedByYear).reduce((acc, [y, arr]) => {
      const yearDataByWeek = groupBy(arr, 'week');
      const zeroFilledData = [];
      for (let i = 1; i <= yearLengths[y]; i += 1) {
        zeroFilledData.push(
          yearDataByWeek[i]
            ? yearDataByWeek[i][0]
            : { count: 0, week: i, year: parseInt(y, 10) }
        );
      }
      return { ...acc, [y]: zeroFilledData };
    }, {});
  }
);

export const getStdDev = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (isEmpty(data) || !settings.year) return null;
    const years = Object.keys(data);
    const { year } = settings;

    const stdevs = [];
    const means = [];

    for (let weeknum = 0; weeknum < 53; weeknum++) {
      const n = years.filter(y => !!data[y][weeknum]).length;
      if (n === 1) {
        means.push(means[means.length - 1]);
        stdevs.push(stdevs[stdevs.length - 1]);
      } else if (n !== 0) {
        const sum = years.reduce(
          (acc, y) => (!data[y][weeknum] ? acc : acc + data[y][weeknum].count),
          0
        );
        const mean = sum / n;
        const divident = years.reduce(
          (acc, y) =>
            (!data[y][weeknum]
              ? acc
              : acc + (data[y][weeknum].count - mean) ** 2),
          0
        );
        const stdev = Math.sqrt(divident / n);
        means.push(mean);
        stdevs.push(stdev);
      }
    }
    return data[year].map((d, i) => {
      const w = means[i] === undefined ? i - 1 : i;
      return {
        ...d,
        mean: means[w],
        twoPlusStdDev: [means[w], means[w] + stdevs[w]],
        twoMinusStdDev: [means[w] - stdevs[w], means[w]]
      };
    });
  }
);

export const getDates = createSelector([getStdDev], data => {
  if (!data) return null;
  return getDatesData(data);
});

export const parseData = createSelector([getDates], data => {
  if (!data) return null;
  return data;
});

export const parseConfig = createSelector(
  [getColors, getSettings],
  (colors, settings) =>
    getChartConfig(
      colors,
      moment()
        .subtract(2, 'w')
        .format('YYYY-MM-DD'),
      settings.variable === 'cumulative_emissions' ? 'tCO\u2082' : 'ha'
    )
);

export const parseSentence = createSelector(
  [parseData, getActiveData, getSentences, getSettings],
  (data, activeData, sentences, settings) => {
    if (!data) return null;
    let lastDate = data[data.length - 1] || {};
    if (!isEmpty(activeData)) {
      lastDate = activeData;
    }

    const { year, variable } = settings;
    const sentence = sentences[variable];
    const weeknum = moment(lastDate.date).isoWeek();
    if (!lastDate.alerts) lastDate = data[weeknum - 1];

    const {
      alerts,
      percent_to_deforestation_target,
      percent_to_emissions_target,
      cumulative_emissions,
      cumulative_deforestation
    } =
      lastDate || {};

    const budget = formatNumber({
      num:
        variable === 'cumulative_emissions'
          ? percent_to_emissions_target
          : percent_to_deforestation_target,
      unit: '%'
    });

    const params = {
      weeknum,
      year,
      alerts: formatNumber({ num: alerts, unit: '' }),
      deforestation: formatNumber({
        num: cumulative_deforestation,
        unit: 'ha'
      }),
      emissions: formatNumber({
        num: cumulative_emissions * 1000000,
        unit: 'tCO\u2082'
      }),
      budget
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
  sentence: parseSentence,
  settings: getDataSettings
});
