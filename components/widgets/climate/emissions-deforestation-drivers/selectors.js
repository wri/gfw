import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sum from 'lodash/sum';
import sumBy from 'lodash/sumBy';
import entries from 'lodash/entries';
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';
import { formatNumber } from 'utils/format';
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
const getAlerts = (state) => state.alerts || [];
const getAdm0 = (state) => state.adm0;

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
    const { startYear, endYear, gasesIncluded } = settings;
    const filteredByYear = data.filter(
      (d) => d.year >= startYear && d.year <= endYear
    );
    const emissionsData = filteredByYear.map((d) => ({
      ...d,
      selectedEmissions: d[gasesIncluded],
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
        unitFormat: (value) =>
          formatNumber({ num: value, unit: 'tCO2', spaceUnit: true }),
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
            color: categoryColors[d.driver],
            unitFormat: (value) =>
              formatNumber({ num: value, unit: 'tCO2', spaceUnit: true }),
          };
        })
        .reverse()
    );

    const forestryIndex = tooltip.findIndex(
      (element) => element.key === 'class_Forestry'
    );
    const agricultureIndex = tooltip.findIndex(
      (element) => element.key === 'class_Shifting agriculture'
    );

    const rearrengedTooltips = [...tooltip];

    delete rearrengedTooltips[forestryIndex];
    delete rearrengedTooltips[agricultureIndex];

    rearrengedTooltips.splice(2, 0, tooltip[forestryIndex]);
    rearrengedTooltips.splice(3, 0, tooltip[agricultureIndex]);

    // Example on how to add columns & titles to the Chart Legend
    // See: https://gfw.atlassian.net/browse/FLAG-1145
    // const chartLegend = {
    //   columns: [
    //     {
    //       items: ['Wildfire', 'Forestry', 'Shifting agriculture']?.map(
    //         (name) => ({ label: name, color: categoryColors[name] })
    //       ),
    //     },
    //     {
    //       title: 'Drivers of permanent deforestation',
    //       items: ['Commodity driven deforestation', 'Urbanization']?.map(
    //         (name) => ({ label: name, color: categoryColors[name] })
    //       ),
    //     },
    //   ],
    // };

    const insertIndex = findIndex(rearrengedTooltips, {
      key: 'class_Urbanization',
    });
    if (insertIndex > -1) {
      rearrengedTooltips.splice(insertIndex, 0, {
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
      unitFormat: (value) =>
        formatNumber({ num: value, specialSpecifier: '.2s', spaceUnit: true }),
      unit: 'tCO2e',
      tooltip: rearrengedTooltips,
      // chartLegend,
    };
  }
);

export const parseSentence = createSelector(
  [getFilteredData, getSettings, getLocationName, getSentences, getPermCats],
  (data, settings, locationName, sentences, permCats) => {
    if (isEmpty(data)) return null;
    const { initial, globalInitial, noLoss, co2Only, nonCo2Only } = sentences;
    const { startYear, endYear, gasesIncluded } = settings;
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
    if (gasesIncluded !== 'allGases') {
      emissionString = gasesIncluded === 'co2Only' ? co2Only : nonCo2Only;
    }
    sentence += emissionString;

    const params = {
      location: locationName === 'global' ? 'Globally' : locationName,
      startYear,
      endYear,
      totalEmissions: formatNumber({
        num: totalEmissions,
        unit: 'tCO2',
        spaceUnit: true,
      }),
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

export const parseAlerts = createSelector(
  [getAlerts, getLocationName, getAdm0],
  (alerts, locationLabel, adm0) => {
    const countriesWithNewWarningText = [
      'CMR',
      'CIV',
      'COD',
      'GNQ',
      'GAB',
      'GHA',
      'GIN',
      'GNB',
      'LBR',
      'MDG',
      'COG',
      'SLE',
    ];

    if (countriesWithNewWarningText.includes(adm0)) {
      return [
        {
          text: `The methods behind the annual tree cover loss data underlying emissions estimates have changed over time, resulting in an underreporting of tree cover loss in ${locationLabel} prior to 2015. We advise against comparing the data before/after 2015 in ${locationLabel}. [Read more here](https://www.globalforestwatch.org/blog/data-and-research/tree-cover-loss-satellite-data-trend-analysis/).`,
          visible: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
        },
      ];
    }

    return alerts;
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
  title: parseTitle,
  alerts: parseAlerts,
});
