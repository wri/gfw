import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import meanBy from 'lodash/meanBy';
import mean from 'lodash/mean';
import groupBy from 'lodash/groupBy';
import upperCase from 'lodash/upperCase';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import concat from 'lodash/concat';
import moment from 'moment';
import { getColorPalette } from 'utils/data';

const MIN_YEAR = 2015;

// get list data
const getAlerts = state => state.alerts || null;
const getLatestDates = state => state.latest || null;
const getColors = state => state.colors || null;
const getActiveData = state => state.activeData || null;
const getWeeks = state => (state.settings && state.settings.weeks) || null;

const getYearsObj = (data, startSlice, endSlice) => {
  const grouped = groupBy(data, 'year');
  return Object.keys(grouped).map(key => ({
    year: key,
    weeks: grouped[key].slice(
      startSlice < 0 ? grouped[key].length + startSlice : startSlice,
      endSlice < 0 ? grouped[key].length : endSlice
    )
  }));
};

const meanData = data => {
  const means = [];
  data.forEach(w => {
    w.weeks.forEach((y, i) => {
      means[i] = means[i] ? [...means[i], y.count] : [y.count];
    });
  });
  return means.map(w => mean(w));
};

const runningMean = (data, windowSize) => {
  const smoothedMean = [];
  data.forEach((d, i) => {
    const slice = data.slice(i, i + windowSize);
    if (i < data.length - windowSize + 1) {
      smoothedMean.push(mean(slice));
    }
  });
  return smoothedMean;
};

export const getData = createSelector(
  [getAlerts, getLatestDates],
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

export const getMeans = createSelector([getData], data => {
  if (!data) return null;
  const minYear = minBy(data, 'year').year;
  const maxYear = maxBy(data, 'year').year;
  const grouped = groupBy(data, 'week');
  const centralMeans = Object.keys(grouped).map(d => {
    const weekData = grouped[d];
    return meanBy(weekData, 'count');
  });
  const leftYears = data.filter(d => d.year !== maxYear);
  const rightYears = data.filter(d => d.year !== minYear);
  const leftMeans = meanData(getYearsObj(leftYears, -6));
  const rightMeans = meanData(getYearsObj(rightYears, 0, 6));
  const allMeans = concat(leftMeans, centralMeans, rightMeans);
  const smoothedMeans = runningMean(allMeans, 12);
  const pastYear = data.slice(-52);
  const parsedData = pastYear.map((d, i) => ({
    ...d,
    mean: smoothedMeans[i]
  }));
  return parsedData;
});

export const getStdDev = createSelector(
  [getMeans, getData],
  (data, rawData) => {
    if (!data) return null;
    const stdDevs = [];
    const centralMeans = data.map(d => d.mean);
    const groupedByYear = groupBy(rawData, 'year');
    const meansFromGroup = Object.keys(groupedByYear).map(key =>
      groupedByYear[key].map(d => d.count)
    );
    for (let i = 0; i < centralMeans.length; i += 1) {
      meansFromGroup.forEach(m => {
        const value = m[i] || 0;
        const some =
          value && centralMeans[i] ? (centralMeans[i] - value) ** 2 : null;
        stdDevs[i] = stdDevs[i] ? [...stdDevs[i], some] : [some];
      });
    }
    const stdDev = mean(stdDevs.map(s => mean(s) ** 0.5));

    return data.map(d => ({
      ...d,
      plusStdDev: [d.mean, d.mean + stdDev],
      minusStdDev: [d.mean - stdDev, d.mean],
      twoPlusStdDev: [d.mean + stdDev, d.mean + stdDev * 2],
      twoMinusStdDev: [d.mean - stdDev * 2, d.mean - stdDev]
    }));
  }
);

export const getDates = createSelector([getStdDev], data => {
  if (!data) return null;
  return data.map(d => ({
    ...d,
    date: moment()
      .year(d.year)
      .week(d.week)
      .format('YYYY-MM-DD'),
    month: upperCase(
      moment()
        .year(d.year)
        .week(d.week)
        .format('MMM')
    )
  }));
});

export const chartData = createSelector([getDates, getWeeks], (data, weeks) => {
  if (!data) return null;
  return data.slice(-weeks);
});

export const chartConfig = createSelector(
  [getColors, chartData],
  (colors, data) => {
    if (!data) return null;
    const lastDate = data[data.length - 1].date;
    const ticks = [];
    while (ticks.length < 12) {
      ticks.push(
        parseInt(
          moment(lastDate)
            .subtract(ticks.length, 'months')
            .format('Mo'),
          10
        )
      );
    }
    return {
      xKey: 'date',
      yKeys: {
        lines: {
          count: {
            stroke: colors.main
          }
        },
        areas: {
          plusStdDev: {
            fill: '#555555',
            stroke: '#555555',
            opacity: 0.1,
            strokeWidth: 0,
            background: false,
            activeDot: false
          },
          minusStdDev: {
            fill: '#555555',
            stroke: '#555555',
            opacity: 0.1,
            strokeWidth: 0,
            background: false,
            activeDot: false
          },
          twoPlusStdDev: {
            fill: '#555555',
            stroke: '#555555',
            opacity: 0.2,
            strokeWidth: 0,
            background: false,
            activeDot: false
          },
          twoMinusStdDev: {
            fill: '#555555',
            stroke: '#555555',
            opacity: 0.2,
            strokeWidth: 0,
            background: false,
            activeDot: false
          }
        }
      },
      xAxis: {
        tickCount: 12,
        interval: 4,
        tickFormatter: t => moment(t).format('MMM')
      },
      yAxis: {
        domain: [0, 'auto'],
        allowDataOverflow: true
      },
      height: '280px'
    };
  }
);

export const getSentence = createSelector(
  [chartData, getColors, getActiveData],
  (data, colors, activeData) => {
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

    return `There were <b style="color: ${colors.main}">${format(',')(
      lastDate.count
    )}</b> GLAD alerts reported in the week of the <b>${date}</b>. This was
    <b style="color: ${statusColor}">${
  status
}</b> compared to the same week in previous years.`;
  }
);
