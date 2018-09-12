import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import entries from 'lodash/entries';
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';
import { format } from 'd3-format';
import moment from 'moment';
import { sortByKey } from 'utils/data';

import tscLossCategories from 'data/tsc-loss-categories.json';

// get list data
const getLoss = state => (state.data && state.data.loss) || null;
const getSettings = state => state.settings || null;
const getCurrentLocation = state => state.currentLabel || null;
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
          position: tscLossCategories.find(c => c.value.toString() === k)
            .position,
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
    return sortedLoss;
  }
);

// get lists selected
export const parseData = createSelector([getFilteredData], data => {
  if (isEmpty(data)) return null;
  const groupedData = groupBy(data, 'year');
  const x = Object.keys(groupedData).map(y => {
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
  return x;
});

export const parseConfig = createSelector(
  [getColors, getFilteredData, getDrivers, getSettings],
  (colors, data, drivers, settings) => {
    if (isEmpty(data)) return null;
    const { highlighted } = settings || {};
    const yKeys = {};
    const categoryColors = colors.lossDrivers;
    sortByKey(drivers, 'position').forEach(k => {
      yKeys[`class_${k.driver}`] = {
        fill: categoryColors[k.driver],
        stackId: 1,
        opacity: !highlighted || (highlighted && k.permanent) ? 1 : 0.3
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
    const insertIndex = findIndex(tooltip, { key: 'class_5' });
    tooltip.splice(insertIndex, 0, {
      key: 'break',
      label: 'Drivers of permanent deforestation'
    });
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
    getSentences,
    getPermCats
  ],
  (data, allLoss, settings, currentLabel, sentences, permCats) => {
    if (isEmpty(data)) return null;
    const { initial, globalInitial, noLoss } = sentences;
    const { startYear, endYear } = settings;

    const filteredLoss = data && data.filter(x => permCats.includes(x.bound1));

    const permLoss =
      (filteredLoss && filteredLoss.length && sumBy(filteredLoss, 'area')) || 0;
    const totalLoss =
      (allLoss && allLoss.length && sumBy(allLoss, 'area')) || 0;
    const permPercent = (permLoss && permLoss / totalLoss * 100) || 0;

    let sentence = currentLabel === 'global' ? globalInitial : initial;
    if (!permLoss) sentence = noLoss;

    const params = {
      location: currentLabel === 'global' ? 'Globally' : currentLabel,
      startYear,
      endYear,
      permPercent:
        permPercent && permPercent < 0.1
          ? '< 0.1%'
          : `${format('.2r')(permPercent)}%`,
      component: {
        key: 'permanent deforestation',
        tooltip:
          'The drivers of permanent deforestation are urbanization and commodity-driven deforestation.'
      }
    };

    return {
      sentence,
      params
    };
  }
);
