import groupBy from 'lodash/groupBy';
import mean from 'lodash/mean';
import meanBy from 'lodash/meanBy';
import concat from 'lodash/concat';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import sumBy from 'lodash/sumBy';
import upperCase from 'lodash/upperCase';
import moment from 'moment';
import range from 'lodash/range';

const translateMeans = (means, latest) => {
  if (!means || !means.length) return null;
  const currentWeek = moment(latest).isoWeek();
  const firstHalf = means.slice(0, currentWeek);
  const secondHalf = means.slice(currentWeek);
  return secondHalf.concat(firstHalf);
};

const getYearsObj = (data, startSlice, endSlice) => {
  const grouped = groupBy(data, 'year');
  return Object.keys(grouped).map(key => ({
    year: parseInt(key, 10),
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

const stdDevData = data => {
  const dataMean = mean(data);
  const sumOfSquares = data.reduce(
    (sum, value) => sum + (dataMean - value) ** 2,
    0
  );
  return (sumOfSquares / data.length) ** 0.5;
};

const statsData = data => {
  const grouped_week = [];

  data.forEach(w => {
    w.weeks.forEach((y, i) => {
      grouped_week[i] = grouped_week[i]
        ? [...grouped_week[i], y.count]
        : [y.count];
    });
  });

  const stats = grouped_week.map((w, i) => {
    const validWeeks = w.filter(el => el !== null);
    const week_mean = mean(validWeeks);
    return {
      week: i + 1,
      mean: week_mean,
      std: stdDevData(validWeeks)
    };
  });
  return stats;
};

const runningMean = (data, windowSize) => {
  const smoothedMean = [];
  data.forEach((d, i) => {
    if (i < data.length - windowSize + 1) {
      const slice = data.slice(i, i + windowSize);
      smoothedMean.push(mean(slice));
    }
  });
  return smoothedMean;
};

const runningMeanWindowed = (data, windowSize) => {
  const smoothedMean = [];
  const buffer = Math.round(windowSize / 2);
  let increment = 1;
  data.forEach((d, i) => {
    let slice = [];
    if (i < buffer) {
      slice = data.slice(0, i + increment);
      increment += 1;
    } else if (i >= data.length - buffer - 1) {
      slice = data.slice(i - increment, data.length - 1);
      increment -= 1;
    } else {
      slice = data.slice(i - buffer, i + buffer);
      increment = 5;
    }
    smoothedMean.push(mean(slice));
  });
  return smoothedMean;
};

export const getMeansData = (data, latest) => {
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
  const translatedMeans = translateMeans(smoothedMeans, latest);
  const pastYear = data.slice(-52);
  const parsedData = pastYear.map((d, i) => ({
    ...d,
    mean: (translatedMeans && translatedMeans[i]) || 0
  }));
  return parsedData;
};

export const getStatsData = (data, latest) => {
  /*
  Creates yearly data structure and uses this to generate weekly mean and standard deviation stats.
  Yearly data structure groups alert data by year and appends the first (or last) 6 weeks
  of data from neighbouring years:

  e.g. The element with year=2015 contains the last 6 weeks of 2014 data,
  followed by 52 weeks of 2015 data, followed by the first 6 weeks of 2016 data

  This is done so that when the data is smoothed we are left with 52 weeks of stats per year.
  */
  const minYear = minBy(data, 'year').year;
  const maxYear = maxBy(data, 'year').year;
  const leftYears = getYearsObj(data.filter(d => d.year !== maxYear), -6);
  const rightYears = getYearsObj(data.filter(d => d.year !== minYear), 0, 6);
  const centralYears = getYearsObj(
    data.filter(d => d.year !== minYear),
    0,
    data.length
  );

  // Get an array of all data with start/end buffers for smoothing
  const allYears = centralYears.map(({ year, weeks }) => {
    const leftYear = leftYears.find(el => el.year === year - 1) || {};
    const rightYear = rightYears.find(el => el.year === year + 1) || {};

    const leftWeeks = leftYear.weeks || [];
    const rightWeeks = rightYear.weeks || [];

    // If current year is 53 weeks, we only need to append 5 from the next year
    const trimmedRightWeeks =
      weeks.length === 53 ? rightWeeks.slice(0, 5) : rightWeeks;

    return {
      year,
      weeks: concat(leftWeeks, weeks, trimmedRightWeeks)
    };
  });

  const stats = statsData(allYears);
  const smoothedMeans = runningMean(stats.map(el => el.mean), 12);
  const smoothedStds = runningMean(stats.map(el => el.std), 12);
  const translatedMeans = translateMeans(smoothedMeans, latest);
  const translatedStds = translateMeans(smoothedStds, latest);

  const pastYear = data.slice(-52);
  const parsedData = pastYear.map((d, i) => {
    const weekMean = (translatedMeans && translatedMeans[i]) || 0;
    const stdDev = (translatedStds && translatedStds[i]) || 0;

    return {
      ...d,
      stdDev,
      mean: weekMean,
      plusStdDev: [weekMean, weekMean + stdDev],
      minusStdDev: [weekMean - stdDev, weekMean],
      twoPlusStdDev: [weekMean + stdDev, weekMean + stdDev * 2],
      twoMinusStdDev: [weekMean - stdDev * 2, weekMean - stdDev]
    };
  });
  return parsedData;
};

export const getPeriodVariance = (data, raw_data) => {
  const minYear = minBy(raw_data, 'year').year;
  const maxYear = maxBy(raw_data, 'year').year;
  const startWeek = data.length && data[0].week;
  const endWeek = data.length && data[data.length - 1].week;

  const yearlyPeriodSum = range(minYear, maxYear, 1).map(year => {
    let slicedData = [];
    if (endWeek > startWeek) {
      slicedData = raw_data.filter(
        d => d.year === year && d.week >= startWeek && d.week <= endWeek
      );
    } else {
      const filteredDataStart = raw_data.filter(
        d => d.year === year && d.week >= startWeek
      );
      const filteredDataEnd = raw_data.filter(
        d => d.year === year + 1 && d.week <= endWeek
      );
      slicedData = concat(filteredDataStart, filteredDataEnd);
    }
    return slicedData.length ? sumBy(slicedData, 'count') : 0;
  });
  const meanPeriodTotal = mean(yearlyPeriodSum);
  const stdPeriodTotal = stdDevData(yearlyPeriodSum);
  const currentperiodTotal = sumBy(data, 'count');
  return stdPeriodTotal > 0
    ? (currentperiodTotal - meanPeriodTotal) / stdPeriodTotal
    : 0;
};

export const getStdDevData = (data, rawData) => {
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
};

export const getCumulativeStatsData = data => {
  const maxYear = maxBy(data, 'year').year;

  const allYears = getYearsObj(data, 0, data.length);

  const stats = statsData(allYears);
  const smoothedMeans = runningMeanWindowed(stats.map(el => el.mean), 12).slice(
    0,
    52
  );
  const smoothedStds = runningMeanWindowed(stats.map(el => el.std), 12).slice(
    0,
    52
  );

  const pastYear = data.filter(d => d.year === maxYear);
  const parsedData = pastYear.map((d, i) => {
    let weekMean = (smoothedMeans && smoothedMeans[i]) || 0;
    let stdDev = (smoothedStds && smoothedStds[i]) || 0;
    if (i === pastYear.length - 1) {
      const diff =
        (smoothedMeans && smoothedMeans[i - 1] - smoothedMeans[i - 2]) || 0;
      const step =
        (smoothedMeans && mean([smoothedMeans[i - 1], smoothedMeans[i - 2]])) ||
        0;
      weekMean = diff + step;
      stdDev = (smoothedStds && smoothedStds[i - 1]) || 0;
    }

    return {
      ...d,
      stdDev,
      mean: weekMean,
      plusStdDev: [weekMean, weekMean + stdDev],
      minusStdDev: [weekMean - stdDev, weekMean],
      twoPlusStdDev: [weekMean + stdDev, weekMean + stdDev * 2],
      twoMinusStdDev: [weekMean - stdDev * 2, weekMean - stdDev]
    };
  });
  return parsedData;
};

export const getDatesData = data =>
  data.map(d => ({
    ...d,
    date: moment()
      .year(d.year)
      .isoWeek(d.week)
      .startOf('isoWeek')
      .format('YYYY-MM-DD'),
    month: upperCase(
      moment()
        .year(d.year)
        .isoWeek(d.week)
        .format('MMM')
    )
  }));

export const getChartConfig = (colors, latest, unit = '') => {
  const ticks = [];
  while (ticks.length < 12) {
    ticks.push(
      parseInt(
        moment(latest)
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
          stroke: colors.main,
          isAnimationActive: false
        },
        compareCount: {
          stroke: '#49b5e3',
          isAnimationActive: false
        },
        target: {
          stroke: 'grey',
          isAnimationActive: false
        }
      },
      areas: {
        plusStdDev: {
          isAnimationActive: false,
          fill: '#555555',
          stroke: '#555555',
          opacity: 0.1,
          strokeWidth: 0,
          background: false,
          activeDot: false
        },
        minusStdDev: {
          isAnimationActive: false,
          fill: '#555555',
          stroke: '#555555',
          opacity: 0.1,
          strokeWidth: 0,
          background: false,
          activeDot: false
        },
        twoPlusStdDev: {
          isAnimationActive: false,
          fill: '#555555',
          stroke: '#555555',
          opacity: 0.2,
          strokeWidth: 0,
          background: false,
          activeDot: false
        },
        twoMinusStdDev: {
          isAnimationActive: false,
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
    height: '280px',
    unit
  };
};

export const yearTicksFormatter = (tick, startYear, endYear) => {
  const year = moment(tick, 'YYYY');
  if (tick === startYear || tick === endYear) {
    return year.format('YYYY');
  }
  return `'${year.format('YY')}`;
};

export const getYearsRange = (data, interval) => {
  const startYearObj = minBy(data, 'year');
  const endYearObj = maxBy(data, 'year');
  const startYear = startYearObj && startYearObj.year;
  const endYear = endYearObj && endYearObj.year;

  return {
    startYear,
    endYear,
    range: range(startYear, endYear + 1, interval || 1).map(y => ({
      label: y,
      value: y
    }))
  };
};
