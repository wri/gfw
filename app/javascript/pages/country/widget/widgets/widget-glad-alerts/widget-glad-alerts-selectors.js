import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import { biomassToCO2 } from 'utils/calculations';
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

// get list data
const getAlerts = state => state.alerts || null;
const getPeriod = state => state.period || null;
const getExtent = state => state.extent || null;
const getSettings = state => state.settings || null;
const getLocationNames = state => state.locationNames || null;
const getActiveIndicator = state => state.activeIndicator || null;
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

const showMeTheMeansJerry = data => {
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
export const chartData = createSelector(
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
      const lastIsoWeek = lastWeek.year !== parseInt(y, 10) ? moment(`${y}-12-31`).isoWeek() : lastWeek.isoWeek;
      yearLengths[y] = lastIsoWeek;
    });
    const zeroFilledData = [];
    years.forEach(d => {
      const yearDataByWeek = groupBy(groupedByYear[d], 'week');
      for (let i = 1; i <= yearLengths[d]; i += 1) {
        zeroFilledData.push(yearDataByWeek[i] ? yearDataByWeek[i][0] : { count: 0, week: i, year: parseInt(d, 10) });
      }
    });
    return zeroFilledData;
  }
);

export const getGladStats = createSelector([chartData], data => {
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
  const leftMeans = showMeTheMeansJerry(getYearsObj(leftYears, -6));
  const rightMeans = showMeTheMeansJerry(getYearsObj(rightYears, 0, 6));

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
  [getGladStats, chartData],
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

export const getData = createSelector(
  [getStdDev, getPeriod],
  (data, period) => {
    if (!data || !period) return null;

    return data.map(d => ({
      ...d,
      date: moment().year(d.year).week(d.week).format('YYYY-MM-DD'),
      month: upperCase(moment().year(d.year).week(d.week).format('MMM'))
    }));
  }
);

export const chartConfig = createSelector(
  [getColors, getData],
  (colors, data) => {
    if (!data) return null;
    return {
      xKey: 'month',
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
  [chartData, getExtent, getSettings, getLocationNames, getActiveIndicator],
  (data, extent, settings, locationNames, indicator) => {
    if (!data) return null;
    const { startYear, endYear, extentYear, threshold } = settings;
    const locationLabel = locationNames.current && locationNames.current.label;
    const locationIntro = `${
      indicator.value !== 'gadm28'
        ? `<b>${indicator.label}</b> in <b>${locationLabel}</b>`
        : `<b>${locationLabel}</b>`
    }`;
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && biomassToCO2(sumBy(data, 'emissions'))) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;

    return `Between <span>${startYear}</span> and <span>${endYear}</span>, ${locationIntro} lost <b>${format(
      '.3s'
    )(totalLoss)}ha</b> of tree cover${totalLoss ? '.' : ','} ${
      totalLoss > 0
        ? ` This loss is equal to <b>${format('.1f')(percentageLoss)}
      %</b> of the regions tree cover extent in <b>${extentYear}</b>,
      and equivalent to <b>${format('.3s')(
    totalEmissions
  )}t</b> of CO\u2082 emissions`
        : ''
    }
     with canopy density <span>> ${threshold}%</span>.`;
  }
);
