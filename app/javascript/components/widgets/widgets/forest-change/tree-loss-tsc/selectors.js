import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import entries from 'lodash/entries';
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';
import { format } from 'd3-format';
import moment from 'moment';
import { sortByKey } from 'utils/data';
import { yearTicksFormatter } from 'components/widgets/utils/data';

import tscLossCategories from 'data/tsc-loss-categories.json';

// get list data
const getLoss = state => (state.data && state.data.loss) || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;
const getTitle = state => state.config.title;

export const getPermCats = createSelector([], () =>
  tscLossCategories.filter(x => x.permanent).map(el => el.value)
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
    const filterUnknown = data.filter(d => d.tcs !== 'Unknown');
    const filteredByYear = filterUnknown.filter(
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
        Object.keys(groupedLoss).map(k => {
          const cat = tscLossCategories.find(c => c.value === k);
          return {
            driver: k,
            position: cat && cat.position,
            area: sumBy(groupedLoss[k], 'area') || 0,
            permanent: permCats.includes(k)
          };
        }),
        'area',
        true
      )
      : permCats.map(x => ({
        driver: x,
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
      const areaSum = sumBy(value, 'area') || 0;
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
          const tscCat = tscLossCategories.find(c => c.value === d.driver);
          const label = tscCat && tscCat.label;
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
    const insertIndex = findIndex(tooltip, { key: 'class_Urbanization' });
    if (insertIndex > -1) {
      tooltip.splice(insertIndex, 0, {
        key: 'break',
        label: 'Drivers of permanent deforestation:'
      });
    }
    return {
      height: 250,
      xKey: 'year',
      yKeys: {
        bars: yKeys
      },
      xAxis: {
        tickFormatter: yearTicksFormatter
      },
      unit: 'ha',
      tooltip
    };
  }
);

export const parseSentence = createSelector(
  [
    getFilteredData,
    getAllLoss,
    getSettings,
    getLocationName,
    getSentences,
    getPermCats
  ],
  (data, allLoss, settings, locationName, sentences, permCats) => {
    if (isEmpty(data)) return null;
    const { initial, globalInitial, noLoss } = sentences;
    const { startYear, endYear } = settings;

    const filteredLoss = data && data.filter(x => permCats.includes(x.bound1));

    const permLoss =
      (filteredLoss && filteredLoss.length && sumBy(filteredLoss, 'area')) || 0;
    const totalLoss =
      (allLoss && allLoss.length && sumBy(allLoss, 'area')) || 0;
    const permPercent = (permLoss && permLoss / totalLoss * 100) || 0;

    let sentence = locationName === 'global' ? globalInitial : initial;
    if (!permLoss) sentence = noLoss;

    const params = {
      location: locationName === 'global' ? 'Globally' : locationName,
      startYear,
      endYear,
      permPercent:
        permPercent && permPercent < 0.1
          ? '< 0.1%'
          : `${format('.2r')(permPercent)}%`,
      component: {
        key: 'deforestation',
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

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.initial;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export const parsePayload = payload => {
  const year = payload && payload[0].payload.year;
  return {
    updateLayer: true,
    startDate:
      year &&
      moment()
        .year(year)
        .startOf('year')
        .format('YYYY-MM-DD'),
    endDate:
      year &&
      moment()
        .year(year)
        .endOf('year')
        .format('YYYY-MM-DD')
  };
};

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence,
  title: parseTitle
});
