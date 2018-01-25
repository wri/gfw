import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import { biomassToCO2 } from 'utils/calculations';
import { sortByKey } from 'utils/data';
import meanBy from 'lodash/meanBy';
import mean from 'lodash/mean';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import max from 'lodash/max';
import compact from 'lodash/compact';
import minBy from 'lodash/minBy';
import concat from 'lodash/concat';
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
export const chartData = createSelector([getAlerts], data => {
  if (!data || isEmpty(data)) return null;
  return sortByKey(
    sortByKey(data, 'year').map(d => ({
      ...d,
      areaCount: d.count * 1.2
    })),
    'week'
  );
});

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

  const thisYear = sortByKey(data.filter(d => d.year === maxYear), 'week');
  const parsedData = thisYear.map((d, i) => ({
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
      plusStdDev: d.mean + stdDev,
      minusStdDev: d.mean - stdDev > 0 ? d.mean - stdDev : 0,
      twoPlusStdDev: d.mean + stdDev * 2,
      twoMinusStdDev: d.mean - stdDev * 2 > 0 ? d.mean - stdDev * 2 : 0
    }));
  }
);

export const getData = createSelector(
  [getStdDev, getPeriod],
  (data, period) => {
    if (!data || !period) return null;
    return data.map(d => ({
      ...d,
      isoWeek: moment(period[1])
        .subtract(53 - d.week, 'week')
        .format('MMM')
    }));
  }
);

export const chartConfig = createSelector([getColors], colors => ({
  xKey: 'isoWeek',
  yKeys: {
    lineKeys: ['count'],
    areaKeys: [
      'mean',
      'plusStdDev',
      'minusStdDev',
      'twoPlusStdDev',
      'twoMinusStdDev'
    ]
  },
  colors: {
    count: colors.pink,
    twoMinusStdDev: '#fff'
  },
  unit: 'counts',
  tooltip: [
    {
      key: 'count',
      unit: 'counts'
    },
    {
      key: 'mean',
      unit: 'counts'
    },
    {
      key: 'plusStdDev',
      unit: 'counts'
    },
    {
      key: 'twoPlusStdDev',
      unit: 'counts'
    },
    {
      key: 'minusStdDev',
      unit: 'counts'
    },
    {
      key: 'twoMinusStdDev',
      unit: 'counts'
    }
  ]
}));

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
