import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import entries from 'lodash/entries';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';
import moment from 'moment';
import { biomassToCO2 } from 'utils/calculations';
import { sortByKey } from 'utils/data';

import tscLossCategories from 'data/tsc-loss-categories.json';

// get list data
const getLoss = state => (state.data && state.data.loss) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getCurrentLocation = state => state.currentLabel || null;
const getIndicator = state => state.indicator || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

export const getFilteredData = createSelector(
  [getLoss, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear } = settings;
    return data.filter(d => d.year >= startYear && d.year <= endYear);
  }
);

export const getDrivers = createSelector([getFilteredData], data => {
  if (isEmpty(data)) return null;
  const groupedLoss = groupBy(sortByKey(data, 'area'), 'bound1');
  const sortedLoss = sortByKey(
    Object.keys(groupedLoss).map(k => ({
      driver: k,
      area: sumBy(groupedLoss[k], 'area')
    })),
    'area',
    true
  );
  return sortBy(
    sortedLoss.map(d => ({
      ...d
    })),
    'area'
  ).reverse();
});

// get lists selected
export const parseData = createSelector([getFilteredData], data => {
  if (isEmpty(data)) return null;
  const groupedData = groupBy(data, 'year');
  return Object.keys(groupedData).map(y => {
    const groupedByBound = groupBy(groupedData[y], 'bound1');
    const datakeys = entries(groupedByBound).reduce((acc, [key, value]) => {
      const areaSum = sumBy(value, 'area');
      return {
        ...acc,
        [`class_${key}`]: areaSum
      };
    }, {});
    return {
      year: y,
      ...datakeys
    };
  });
});

export const parseConfig = createSelector(
  [getColors, getFilteredData, getDrivers],
  (colors, data, drivers) => {
    if (isEmpty(data)) return null;
    const yKeys = {};
    const categoryColors = colors.lossDrivers;
    drivers.forEach(k => {
      yKeys[`class_${k.driver}`] = {
        fill: categoryColors[k.driver],
        stackId: 1
      };
    });
    let tooltip = [
      {
        key: 'year'
      }
    ];
    tooltip = tooltip.concat(
      drivers
        .map(d => {
          const label = tscLossCategories[d.driver - 1].label;
          return {
            key: `class_${d.driver}`,
            label,
            unit: 'ha',
            color: categoryColors[d.driver],
            unitFormat: value => format('.3s')(value)
          };
        })
        .reverse()
    );

    return {
      xKey: 'year',
      yKeys: {
        bars: yKeys
      },
      xAxis: {
        tickFormatter: tick => {
          const year = moment(tick, 'YYYY');
          if ([2001, 2017].includes(tick)) {
            return year.format('YYYY');
          }
          return year.format('YY');
        }
      },
      unit: 'ha',
      tooltip
    };
  }
);

export const getSentence = createSelector(
  [
    getFilteredData,
    getExtent,
    getSettings,
    getCurrentLocation,
    getIndicator,
    getSentences,
    getDrivers
  ],
  (data, extent, settings, currentLabel, indicator, sentences, drivers) => {
    if (!data) return null;
    const { initial, globalInitial, perm, temp } = sentences;
    const { startYear, endYear, extentYear } = settings;
    const { driver, area } = drivers[0];
    const { label, type } = tscLossCategories[driver - 1];

    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && biomassToCO2(sumBy(data, 'emissions'))) || 0;
    const percentageLoss = (totalLoss && area && area / totalLoss * 100) || 0;

    let sentence = currentLabel === 'global' ? globalInitial : initial;

    const params = {
      indicator: indicator && indicator.label.toLowerCase(),
      location:
        currentLabel === 'global'
          ? {
            value: 'Globally',
            tooltip: 'this dataset is available in certain countries'
          }
          : currentLabel,
      startYear,
      endYear,
      driver: label.toLowerCase(),
      loss:
        totalLoss < 1
          ? `${format('.3s')(totalLoss)}ha`
          : `${format('.3s')(totalLoss)}ha`,
      percent: `${format('.2r')(percentageLoss)}%`,
      emissions: `${format('.3s')(totalEmissions)}t`,
      extentYear
    };

    sentence = type === 'permanent' ? sentence + perm : sentence + temp;
    return {
      sentence,
      params
    };
  }
);
