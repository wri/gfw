import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import tscLossCategories from 'data/tsc-loss-categories.json';
import { formatNumber } from 'utils/format';

const getData = (state) => state.data;
const getColors = (state) => state.colors;
const getSettings = (state) => state.settings;
const getTitle = (state) => state.title;
const getSentences = (state) => state.sentences;
const getLocationLabel = (state) => state.locationLabel;
const getSortedCategories = () =>
  tscLossCategories.sort((a, b) => (a.position > b.position ? 1 : -1));

const groupedLegends = {
  'commodity driven deforestation': 'Drivers of deforestation',
  forestry: 'Drivers of temporary disturbances',
  'forest management': 'Drivers of temporary disturbances',
  'shifting cultivation': 'Drivers of temporary disturbances',
  'shifting agriculture': 'Drivers of temporary disturbances',
  wildfire: 'Drivers of temporary disturbances',
  'other natural disasters': 'Drivers of temporary disturbances',
  'hard commodities': 'Drivers of deforestation',
  'Drivers of deforestation agriculture': 'Drivers of deforestation',
  'settlements and infrastructure': 'Drivers of deforestation',
  urbanization: 'Drivers of deforestation',
  unknown: 'Drivers of deforestation',
};

export const getPermanentCategories = createSelector(
  [getSortedCategories],
  (sortedCategories) =>
    sortedCategories.filter((x) => x.permanent).map((el) => el.value.toString())
);

export const getFilteredData = createSelector(
  [getData, getSortedCategories],
  (data, sortedCategories) =>
    data && data.length
      ? sortedCategories
          .map(({ value }) => data.find((item) => item.driver_type === value))
          .filter((item) => item)
      : []
);

export const parseData = createSelector(
  [getFilteredData, getColors],
  (filteredData, colors) => {
    if (!filteredData || isEmpty(filteredData)) return null;

    const categoryColors = colors.lossDrivers;

    const totalLoss = filteredData.reduce(
      (acc, { loss_area_ha }) => acc + loss_area_ha,
      0
    );

    return filteredData.map(({ driver_type, loss_area_ha }) => {
      return {
        label: driver_type,
        value: loss_area_ha,
        category: groupedLegends[driver_type.toLowerCase()],
        color: categoryColors[driver_type],
        percentage: (loss_area_ha * 100) / totalLoss,
      };
    });
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationLabel],
  (title, location) => {
    let selectedTitle = title.initial;
    if (location === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export const parseSentence = createSelector(
  [
    getFilteredData,
    getSentences,
    getSettings,
    getLocationLabel,
    getPermanentCategories,
  ],
  (filteredData, sentences, settings, location, permanentCategories) => {
    if (!filteredData) return null;
    const { globalInitial, initial } = sentences;
    const { startYear, endYear } = settings;
    const sentence = location === 'global' ? globalInitial : initial;

    const totalLoss = filteredData.reduce(
      (acc, { loss_area_ha }) => acc + loss_area_ha,
      0
    );

    const permanentLoss = filteredData.reduce(
      (acc, { driver_type, loss_area_ha }) =>
        permanentCategories.includes(driver_type) ? acc + loss_area_ha : acc,
      0
    );

    const params = {
      location,
      startYear,
      endYear,
      lossPercentage: formatNumber({
        num: (permanentLoss * 100) / totalLoss,
        unit: '%',
      }),
      component: {
        key: 'deforestation',
        tooltip:
          'The Drivers of deforestation are mainly urbanization and commodity-driven deforestation. Shifting agriculture may or may not lead to deforestation, depending upon the impact and permanence of agricultural activities.',
      },
    };

    return {
      sentence,
      params,
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  title: parseTitle,
  sentence: parseSentence,
});
