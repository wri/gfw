import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import { formatNumber } from 'utils/format';
import sortBy from 'lodash/sortBy';

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

const groupedLegends = {
  'class_Commodity driven deforestation': 'Drivers of deforestation',
  class_Forestry: 'Drivers of temporary disturbances',
  'forest management': 'Drivers of temporary disturbances',
  'shifting cultivation': 'Drivers of temporary disturbances',
  'class_Shifting agriculture': 'Drivers of temporary disturbances',
  class_Wildfire: 'Drivers of temporary disturbances',
  'other natural disasters': 'Drivers of temporary disturbances',
  'hard commodities': 'Drivers of deforestation',
  'Drivers of deforestation agriculture': 'Drivers of deforestation',
  'settlements and infrastructure': 'Drivers of deforestation',
  class_Urbanization: 'Drivers of deforestation',
  unknown: 'Drivers of deforestation',
};

export const mergeDataWithCetagories = createSelector(
  [getEmissions, getPermCats],
  (data, permCats) => {
    if (isEmpty(data)) return null;
    return data.map((d) => ({
      ...d,
      permanent: permCats.includes(d.driver_type),
    }));
  }
);

export const getFilteredData = createSelector(
  [mergeDataWithCetagories, getSettings, getPermCats],
  (data, settings, permCats) => {
    if (isEmpty(data)) return null;
    const { gasesIncluded } = settings;
    const emissionsData = data.map((d) => ({
      ...d,
      selectedEmissions: d[gasesIncluded],
    }));
    const permanentData = emissionsData.filter((d) =>
      permCats.includes(d.driver_type)
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
      'driver_type'
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
export const parseData = createSelector(
  [getFilteredData, getColors],
  (data, colors) => {
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

    const categoryColors = colors.lossDrivers;
    /**
     * [
     *   {
     *     year: string;
     *     total: number;
     *     'class_Commodity driven deforestation': number;
     *     'class_Forestry': number;
     *     'class_Shifting agriculture': number;
     *     'class_Urbanization': number;
     *     'class_Wildfire': number;
     *   },
     * ]
     */
    const dataList = Object.values(x);
    const totalsEntry = dataList.reduce(
      (acc, entry) => ({
        total: acc.total + entry.total,
        'class_Commodity driven deforestation':
          acc['class_Commodity driven deforestation'] +
          (entry['class_Commodity driven deforestation'] || 0),
        class_Forestry: acc.class_Forestry + (entry.class_Forestry || 0),
        'class_Shifting agriculture':
          acc['class_Shifting agriculture'] +
          (entry['class_Shifting agriculture'] || 0),
        class_Urbanization:
          acc.class_Urbanization + (entry.class_Urbanization || 0),
        class_Wildfire: acc.class_Wildfire + (entry.class_Wildfire || 0),
      }),
      {
        total: 0,
        'class_Commodity driven deforestation': 0,
        class_Forestry: 0,
        'class_Shifting agriculture': 0,
        class_Urbanization: 0,
        class_Wildfire: 0,
      }
    );

    const formattedResult = Object.entries(totalsEntry)
      .filter(([key]) => key !== 'total')
      .map(([key, value]) => {
        return {
          label: key.replace('class_', ''),
          value,
          category: groupedLegends[key],
          color: categoryColors[key.replace('class_', '')],
          percentage: (value * 100) / totalsEntry.total,
        };
      });

    return formattedResult;
  }
);

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

    const { startYear, endYear } = settings;
    const yearRange = endYear - (startYear - 1);

    const totalsEntry = {
      total: data.reduce(
        (acc, entry) => acc + (entry.gross_carbon_emissions_Mg || 0),
        0
      ),
      'Hard commodities':
        data.find((item) => item.driver_type === 'Hard commodities')
          ?.gross_carbon_emissions_Mg || 0,
      Logging:
        data.find((item) => item.driver_type === 'Logging')
          ?.gross_carbon_emissions_Mg || 0,
      'Other natural disturbances':
        data.find((item) => item.driver_type === 'Other natural disturbances')
          ?.gross_carbon_emissions_Mg || 0,
      'Permanent agriculture':
        data.find((item) => item.driver_type === 'Permanent agriculture')
          ?.gross_carbon_emissions_Mg || 0,
      'Settlements & Infrastructure':
        data.find((item) => item.driver_type === 'Settlements & Infrastructure')
          ?.gross_carbon_emissions_Mg || 0,
      'Shifting cultivation':
        data.find((item) => item.driver_type === 'Shifting cultivation')
          ?.gross_carbon_emissions_Mg || 0,
      Wildfire:
        data.find((item) => item.driver_type === 'Wildfire')
          ?.gross_carbon_emissions_Mg || 0,
    };

    const formattedResult = Object.entries(totalsEntry)
      .filter(([key]) => key !== 'total')
      .map(([key, value]) => {
        return {
          label: key,
          value: value / yearRange,
          category: groupedLegends[key],
          color: categoryColors[key],
          percentage: (value * 100) / totalsEntry.total,
          unit: 'tCO2',
          suffix: 'per year',
        };
      });

    return formattedResult;
  }
);

export const parseSentence = createSelector(
  [getFilteredData, getSettings, getLocationName, getSentences],
  (data, settings, locationName, sentences) => {
    if (isEmpty(data)) return null;
    const { initial, globalInitial, noLoss, co2Only, nonCo2Only } = sentences;
    const { startYear, endYear, gasesIncluded } = settings;
    const yearRange = endYear - (startYear - 1);

    const totalEmissions = data.reduce((acc, entry) => {
      if (groupedLegends[entry.driver_type] === 'Drivers of deforestation') {
        return acc + (entry.gross_carbon_emissions_Mg || 0);
      }

      return acc;
    }, 0);

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
        num: totalEmissions / yearRange,
        unit: 'tCO2',
        spaceUnit: true,
      }),
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
    let selectedTitle = title.default;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  config: () => null,
  sentence: parseSentence,
  title: parseTitle,
  alerts: () => [],
});
