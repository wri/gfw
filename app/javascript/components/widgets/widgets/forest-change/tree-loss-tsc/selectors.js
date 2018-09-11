import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import entries from 'lodash/entries';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { format } from 'd3-format';
import moment from 'moment';
import { sortByKey } from 'utils/data';

import tscLossCategories from 'data/tsc-loss-categories.json';

// get list data
const getLoss = state => (state.data && state.data.loss) || null;
const getSettings = state => state.settings || null;
const getCurrentLocation = state => state.currentLabel || null;
const getIndicator = state => state.indicator || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

export const getPermCats = createSelector([], () =>
  tscLossCategories.filter(x => x.permanent).map(el => el.value.toString())
);

export const mergeDataWithCetagories = createSelector(
  [getLoss, getPermCats],
  (data, permCats) => {
    if (isEmpty(data)) return null;
    return data.map(d => ({
      ...d,
      permanent: permCats.includes(d.bound1)
    }));
  }
);

export const getFilteredData = createSelector(
  [mergeDataWithCetagories, getSettings, getPermCats],
  (data, settings, permCats) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear } = settings;
    const filteredByYear = data.filter(
      d => d.year >= startYear && d.year <= endYear
    );
    const permanentData = filteredByYear.filter(d =>
      permCats.includes(d.bound1)
    );
    return settings.tscDriverGroup === 'permanent'
      ? permanentData
      : filteredByYear;
  }
);

export const getAllLoss = createSelector(
  [mergeDataWithCetagories, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear } = settings;
    return data.filter(d => d.year >= startYear && d.year <= endYear);
  }
);

export const getDrivers = createSelector(
  [getFilteredData, getSettings, getPermCats],
  (data, settings, permCats) => {
    if (isEmpty(data)) return null;
    const groupedData = groupBy(sortByKey(data, 'area'), 'bound1');
    const filteredData = Object.keys(groupedData)
      .filter(key => permCats.includes(key))
      .reduce(
        (obj, key) => ({
          ...obj,
          [key]: groupedData[key]
        }),
        {}
      );

    const groupedLoss =
      settings.tscDriverGroup === 'permanent' ? filteredData : groupedData;
    const sortedLoss = !isEmpty(groupedLoss)
      ? sortByKey(
        Object.keys(groupedLoss).map(k => ({
          driver: k,
          area: sumBy(groupedLoss[k], 'area'),
          permanent: permCats.includes(k)
        })),
        'area',
        true
      )
      : permCats.map(x => ({
        driver: x.toString(),
        area: 0.0
      }));

    return sortBy(
      sortedLoss.map(d => ({
        ...d
      })),
      'area'
    ).reverse();
  }
);

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
  [getColors, getFilteredData, getDrivers, getSettings],
  (colors, data, drivers, settings) => {
    if (isEmpty(data)) return null;
    const { highlighted } = settings || {};
    const yKeys = {};
    const categoryColors = colors.lossDrivers;
    drivers.forEach(k => {
      yKeys[`class_${k.driver}`] = {
        fill: categoryColors[k.driver],
        stackId: 1,
        opacity: !highlighted || (highlighted && k.permanent) ? 1 : 0.5
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
          const label = tscLossCategories.find(
            c => c.value === parseInt(d.driver, 10)
          ).label;
          return {
            key: `class_${d.driver}`,
            label,
            unit: 'ha',
            color: categoryColors[d.driver],
            unitFormat: value => format('.3s')(value || 0)
          };
        })
        .reverse()
    );

    return {
      height: 250,
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
    getAllLoss,
    getSettings,
    getCurrentLocation,
    getIndicator,
    getSentences,
    getDrivers,
    getPermCats
  ],
  (
    data,
    allLoss,
    settings,
    currentLabel,
    indicator,
    sentences,
    drivers,
    permCats
  ) => {
    if (isEmpty(data)) return null;
    const { initial, globalInitial } = sentences;
    const { startYear, endYear, extentYear } = settings;
    const { driver } = drivers[0];
    const { label } = tscLossCategories[driver - 1];

    const filteredLoss = data && data.filter(x => permCats.includes(x.bound1));

    const permLoss =
      (filteredLoss && filteredLoss.length && sumBy(filteredLoss, 'area')) || 0;
    const totalLoss =
      (allLoss && allLoss.length && sumBy(allLoss, 'area')) || 0;
    const permPercent = (permLoss && permLoss / totalLoss * 100) || 0;
    const sentence = currentLabel === 'global' ? globalInitial : initial;

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
          ? `${format('.3r')(totalLoss)}ha`
          : `${format('.3s')(totalLoss)}ha`,
      group: settings.tscDriverGroup,
      permPercent:
        permPercent < 0.1 ? '<0.1%' : `${format('.2r')(permPercent)}%`,
      permLoss:
        permLoss < 1
          ? `${format('.3r')(permLoss)}ha`
          : `${format('.3s')(permLoss)}ha`,
      extentYear
    };

    return {
      sentence,
      params
    };
  }
);
