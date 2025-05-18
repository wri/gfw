import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
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

export const getPermCats = createSelector([], () =>
  tscLossCategories.filter((x) => x.permanent).map((el) => el.value.toString())
);

const groupedLegends = {
  'Hard commodities': 'Drivers of deforestation',
  Logging: 'Drivers of temporary disturbances',
  'Other natural disturbances': 'Drivers of temporary disturbances',
  'Permanent agriculture': 'Drivers of deforestation',
  'Settlements & Infrastructure': 'Drivers of deforestation',
  'Shifting cultivation': 'Drivers of temporary disturbances',
  Unknown: 'Drivers of deforestation',
  Wildfire: 'Drivers of temporary disturbances',
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
    if (isEmpty(data)) {
      return null;
    }

    const categoryColors = colors.lossDrivers;
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
      Unknown:
        data.find((item) => item.driver_type === 'Unknown')
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
          value,
          category: groupedLegends[key],
          color: categoryColors[key],
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
  [getFilteredData, getSettings, getLocationName, getSentences],
  (data, settings, locationName, sentences) => {
    if (isEmpty(data)) return null;
    const { initial, globalInitial, noLoss, co2Only, nonCo2Only } = sentences;
    const { startYear, endYear, gasesIncluded } = settings;

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
        num: totalEmissions,
        unit: 'tCO2',
        spaceUnit: true,
      }),
      component: {
        key: 'permanent deforestation',
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
  alerts: () => [],
});
