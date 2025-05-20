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
  'Hard commodities': 'Drivers of deforestation',
  Logging: 'Drivers of temporary disturbances',
  'Other natural disturbances': 'Drivers of temporary disturbances',
  'Permanent agriculture': 'Drivers of deforestation',
  'Settlements & Infrastructure': 'Drivers of deforestation',
  'Shifting cultivation': 'Drivers of temporary disturbances',
  Wildfire: 'Drivers of temporary disturbances',
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
      (acc, { loss_area_ha, driver_type }) => {
        if (driver_type === 'Unknown') {
          return acc;
        }

        return acc + loss_area_ha;
      },
      0
    );

    return filteredData
      .filter((item) => item.driver_type !== 'Unknown')
      .map(({ driver_type, loss_area_ha }) => {
        return {
          label: driver_type,
          value: loss_area_ha,
          category: groupedLegends[driver_type],
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
  [getFilteredData, getSentences, getSettings, getLocationLabel],
  (filteredData, sentences, settings, location) => {
    if (!filteredData) return null;
    const { globalInitial, initial } = sentences;
    const { startYear, endYear } = settings;
    const sentence = location === 'global' ? globalInitial : initial;

    const totalLoss = filteredData.reduce(
      (acc, { loss_area_ha, driver_type }) => {
        if (driver_type === 'Unknown') {
          return acc;
        }

        return acc + loss_area_ha;
      },
      0
    );

    const permanentLoss = filteredData.reduce(
      (acc, { driver_type, loss_area_ha }) => {
        if (groupedLegends[driver_type] !== 'Drivers of deforestation') {
          return acc;
        }

        return acc + loss_area_ha;
      },
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
