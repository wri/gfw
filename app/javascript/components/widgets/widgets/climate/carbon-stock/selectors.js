import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';
import { aboveGroundToBelowGround } from 'utils/calculations';

const getData = state => state.data;
const getLocationName = state => state.locationName;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;
const getVariables = state => state.options && state.options.variables;
const getTitle = state => state.config.title;
const getSettings = state => state.settings;

export const calculateData = createSelector(
  [getData, getSettings, getVariables],
  (data, settings, variables) => {
    if (isEmpty(data)) return null;
    const soil = data && data.soilCarbon[settings.variable];
    const aboveGround = data.aboveGround[settings.variable] * 0.5;
    const belowGround = aboveGroundToBelowGround(aboveGround) * 0.5;
    const total = soil + aboveGround + belowGround;
    const activeVariable =
      variables && variables.find(v => v.value === settings.variable);
    const { unit } = activeVariable || {};

    return {
      soil,
      aboveGround,
      belowGround,
      total,
      unit
    };
  }
);

export const parseData = createSelector(
  [calculateData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    const { soil, aboveGround, belowGround, total, unit } = data || {};

    return [
      {
        label: 'Soil carbon',
        value: soil,
        unit,
        color: colors.carbon[0],
        percentage: soil / total * 100
      },
      {
        label: 'Above ground carbon',
        value: aboveGround,
        unit,
        color: colors.carbon[1],
        percentage: aboveGround / total * 100
      },
      {
        label: 'Below ground carbon',
        value: belowGround,
        unit,
        color: colors.carbon[2],
        percentage: belowGround / total * 100
      }
    ];
  }
);

export const parseSentence = createSelector(
  [calculateData, getLocationName, getSentences],
  (data, locationName, sentence) => {
    if (!data) return null;
    const { soil, aboveGround, belowGround, total, unit } = data || {};

    const allGround = aboveGround + belowGround;

    const params = {
      location: locationName,
      carbonStored: allGround > soil ? 'biomass' : 'soil',
      carbonValue: formatNumber({ num: total, unit })
    };

    return {
      sentence,
      params
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, location) => title.replace('{location}', location)
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
