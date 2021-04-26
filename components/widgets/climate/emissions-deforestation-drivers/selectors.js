import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sum from 'lodash/sum';
import sumBy from 'lodash/sumBy';
import entries from 'lodash/entries';
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import { yearTicksFormatter } from 'components/widgets/utils/data';

import tscLossCategories from 'data/tsc-loss-categories.json';

// get list data
const getEmissions = (state) => state.data && state.data.emissions;
const getSettings = (state) => state.settings;
const getLocationName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSentences = (state) => state.sentences;
const getTitle = (state) => state.title;

export const getPermCats = createSelector([], () =>
  tscLossCategories.filter((x) => x.permanent).map((el) => el.value.toString())
);

export const mergeDataWithCetagories = createSelector(
  [getEmissions, getPermCats],
  (data, permCats) => {
    if (isEmpty(data)) return null;
    return data.map((d) => ({
      ...d,
      permanent: permCats.includes(d.bound1),
    }));
  }
);

export const getFilteredData = createSelector(
  [mergeDataWithCetagories, getSettings, getPermCats],
  (data, settings, permCats) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear, emissionType } = settings;
    const filteredByYear = data.filter(
      (d) => d.year >= startYear && d.year <= endYear
    );
    const emissionsData = filteredByYear.map((d) => ({
      ...d,
      selectedEmissions: d[emissionType],
    }));
    const permanentData = emissionsData.filter((d) =>
      permCats.includes(d.bound1)
    );
    return settings.tscDriverGroup === 'permanent'
      ? permanentData
      : emissionsData;
  }
);

export const getDrivers = createSelector(
  [getFilteredData, getSettings, getPermCats],
  (data, settings, permCats) => {
    if (isEmpty(data)) return null;

    const groupedData = groupBy(
      sortBy(data, 'selectedEmissions').reverse(),
      'bound1'
    );
    const filteredData = Object.keys(groupedData)
      .filter((key) => permCats.includes(key))
      .reduce(
        (obj, key) => ({
          ...obj,
          [key]: groupedData[key],
        }),
        {}
      );

    const groupedLoss =
      settings.tscDriverGroup === 'permanent' ? filteredData : groupedData;
    const sortedLoss = !isEmpty(groupedLoss)
      ? sortBy(
          Object.keys(groupedLoss).map((k) => {
            const cat = tscLossCategories.find((c) => c.value.toString() === k);
            return {
              driver: k,
              position: cat && cat.position,
              area: sumBy(groupedLoss[k], 'selectedEmissions'),
              permanent: permCats.includes(k),
            };
          }),
          'area'
        )
      : permCats.map((x) => ({
          driver: x.toString(),
          area: 0.0,
        }));
    return sortedLoss;
  }
);

// get lists selected
export const parseData = createSelector([getFilteredData], (data) => {
  if (isEmpty(data)) return null;
  const groupedData = groupBy(data, 'year');
  const x = Object.keys(groupedData).map((y) => {
    const groupedByBound = groupBy(groupedData[y], 'bound1');
    const datakeys = entries(groupedByBound).reduce((acc, [key, value]) => {
      const areaSum = sumBy(value, 'selectedEmissions');
      return {
        ...acc,
        [`class_${key}`]: areaSum < 1000 ? Math.round(areaSum) : areaSum,
      };
    }, {});
    return {
      year: y,
      total: sum(Object.values(datakeys)),
      ...datakeys,
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
    sortBy(drivers, 'position').forEach((k) => {
      yKeys[`class_${k.driver}`] = {
        fill: categoryColors[k.driver],
        stackId: 1,
        opacity: !highlighted || (highlighted && k.permanent) ? 1 : 0.3,
      };
    });
    let tooltip = [
      {
        key: 'year',
      },
      {
        key: 'total',
        label: 'Total',
        unit: 't CO2e',
        unitFormat: (value) =>
          value < 1000 ? Math.round(value) : format('.3s')(value),
      },
    ];
    tooltip = tooltip.concat(
      sortBy(drivers, 'position')
        .map((d) => {
          const tscCat = tscLossCategories.find((c) => c.value === d.driver);
          const label = tscCat && tscCat.label;
          return {
            key: `class_${d.driver}`,
            label,
            unit: 't CO2e',
            color: categoryColors[d.driver],
            unitFormat: (value) =>
              value < 1000 ? Math.round(value) : format('.3s')(value),
          };
        })
        .reverse()
    );
    const insertIndex = findIndex(tooltip, { key: 'class_Urbanization' });
    if (insertIndex > -1) {
      tooltip.splice(insertIndex, 0, {
        key: 'break',
        label: 'Drivers of permanent deforestation:',
      });
    }
    return {
      height: 250,
      xKey: 'year',
      yKeys: {
        bars: yKeys,
      },
      xAxis: {
        tickFormatter: yearTicksFormatter,
      },
      unit: 't CO2e',
      tooltip,
    };
  }
);

export const parseSentence = createSelector(
  [getFilteredData, getSettings, getLocationName, getSentences, getPermCats],
  (data, settings, locationName, sentences, permCats) => {
    if (isEmpty(data)) return null;
    const { initial, globalInitial, noLoss, co2Only, nonCo2Only } = sentences;
    const { startYear, endYear, emissionType } = settings;
    const filteredEmissions =
      data && data.filter((x) => permCats.includes(x.bound1));

    const totalEmissions =
      (filteredEmissions &&
        filteredEmissions.length &&
        sumBy(filteredEmissions, 'selectedEmissions')) ||
      0;

    let sentence = locationName === 'global' ? globalInitial : initial;
    if (!totalEmissions) sentence = noLoss;

    let emissionString = '.';
    if (emissionType !== 'emissionsAll') {
      emissionString = emissionType === 'emissionsCo2' ? co2Only : nonCo2Only;
    }
    sentence += emissionString;

    const params = {
      location: locationName === 'global' ? 'Globally' : locationName,
      startYear,
      endYear,
      totalEmissions: `${format('.3s')(totalEmissions)}t CO2e`,
      component: {
        key: 'deforestation',
        tooltip:
          'The drivers of permanent deforestation are mainly urbanization and commodity-driven deforestation. Shifting agriculture may or may not lead to deforestation, depending upon the impact and permanence of agricultural activities.',
      },
    };

    return {
      sentence,
      params,
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

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
  title: parseTitle,
});
