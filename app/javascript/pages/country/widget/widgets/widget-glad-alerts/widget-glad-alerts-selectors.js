import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import meanBy from 'lodash/meanBy';
import mean from 'lodash/mean';
import groupBy from 'lodash/groupBy';
import upperCase from 'lodash/upperCase';
import maxBy from 'lodash/maxBy';
import compact from 'lodash/compact';
import minBy from 'lodash/minBy';
import concat from 'lodash/concat';
import reverse from 'lodash/reverse';
import moment from 'moment';
import { getColorPalette } from 'utils/data';

// get list data
const getAlerts = state => state.alerts || null;
const getPeriod = state => state.period || null;
const getSettings = state => state.settings || null;
const getColors = state => state.colors || null;

const getYearsObj = (data, startSlice, endSlice) => {
  const grouped = groupBy(data, 'year');

  return Object.keys(grouped).map(key => ({
    year: key,
    weeks: grouped[key].slice(
      startSlice < 0 ? grouped[key].length + startSlice : startSlice,
      startSlice < 0 ? grouped[key].length : endSlice
    )
  }));
};

const getMeans = data => {
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
    smoothedMean.push(mean(slice));
  });
  return smoothedMean;
};

// get lists selected
export const getData = createSelector(
  [getAlerts, getPeriod],
  (data, period) => {
    if (!data || isEmpty(data)) return null;
    // fill zeros for data based on last date
    const groupedByYear = groupBy(data, 'year');
    // get size of each year
    const years = Object.keys(groupedByYear);
    const yearLengths = {};
    const lastWeek = {
      isoWeek: moment(period[0]).isoWeek(),
      year: moment(period[0]).year()
    };
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

export const getGladStats = createSelector([getData], data => {
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
  const leftMeans = getMeans(getYearsObj(leftYears, -6));
  const rightMeans = getMeans(getYearsObj(rightYears, 0, 6));

  const allMeans = concat(leftMeans, centralMeans, rightMeans);
  const smoothedMeans = runningMean(allMeans, 12);

  // get from now week back one year not just current year
  const pastYear = data.slice(-52);

  const parsedData = pastYear.map((d, i) => ({
    ...d,
    mean: smoothedMeans[i]
  }));

  return parsedData;
});

export const getStdDev = createSelector(
  [getGladStats, getData],
  (meanedData, rawData) => {
    if (!meanedData) return null;
    const stdDevs = [];
    const centralMeans = meanedData.map(d => d.mean);
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

    const stdDev = mean(stdDevs.map(s => mean(compact(s)) ** 0.5));

    return meanedData.map(d => ({
      ...d,
      plusStdDev: [d.mean, d.mean + stdDev],
      minusStdDev: [d.mean - stdDev, d.mean],
      twoPlusStdDev: [d.mean + stdDev, d.mean + stdDev * 2],
      twoMinusStdDev: [d.mean - stdDev * 2, d.mean - stdDev]
    }));
  }
);

export const chartData = createSelector(
  [getStdDev, getPeriod, getSettings],
  (data, period, settings) => {
    if (!data || !period) return null;

    return data
      .map(d => ({
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
      }))
      .slice(-settings.weeks);
  }
);

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
        lineKeys: ['count'],
        areaKeys: [
          'plusStdDev',
          'minusStdDev',
          'twoPlusStdDev',
          'twoMinusStdDev'
        ]
      },
      colors: {
        count: colors.pink,
        plusStdDev: '#555555',
        minusStdDev: '#555555',
        twoPlusStdDev: '#555555',
        twoMinusStdDev: '#555555'
      },
      xAxisConfig: {
        ticks: reverse(ticks)
      },
      opacity: {
        plusStdDev: 0.2,
        minusStdDev: 0.2,
        twoPlusStdDev: 0.1,
        twoMinusStdDev: 0.1
      }
    };
  }
);

export const getSentence = createSelector(
  [chartData, getColors],
  (data, colors) => {
    if (!data) return null;
    const colorRange = getColorPalette(colors.ramp, 5);
    let statusColor = colorRange[4];
    let status = 'unusually low';
    const lastDate = data[data.length - 1];
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
      lastDate.count <= lastDate.twoMinusStdDev[0] &&
      lastDate.count > lastDate.twoMinusStdDev[1]
    ) {
      status = 'low';
      statusColor = colorRange[3];
    }
    const date = moment(lastDate.date).format('Do of MMMM');

    return `There were <b style="color: ${colors.pink}">${format(',')(
      lastDate.count
    )}</b> GLAD alerts reported in the week of the <b>${date}</b>, <b style="color: ${statusColor}">${status}</b> compared to the same week in previous years.`;
  }
);
