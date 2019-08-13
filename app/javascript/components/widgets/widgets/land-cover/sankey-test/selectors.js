import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';

const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config.sentence || null;

export const parseData = createSelector([getData], data => data);

export const parseConfig = createSelector(
  [parseData, getColors, getSettings],
  (dataKeys, colors, settings) => {
    if (isEmpty(dataKeys)) return null;
    const colorsByType =
      settings.type === 'bound1' ? colors.types : colors.species;
    return {
      colors: colorsByType,
      unit: '%',
      xKey: 'region',
      yKeys: dataKeys,
      yAxisDotFill: '#d4d4d4',
      tooltip: dataKeys.map(item => ({
        key: item,
        label: item,
        color: colorsByType[item],
        unit: '%',
        unitFormat: value => format('.1f')(value)
      }))
    };
  }
);

export const parseSentence = createSelector(
  [parseData, getLocationName, getSentences],
  (data, locationName, sentence) => {
    if (!data || !data.length) return null;
    const params = {
      fromYear: 2001,
      toYear: 2011,
      firstCategory: 'Forest',
      secondCategory: 'Wetlands',
      amount: '232Mha',
      percentage: '7.3%'
    };
    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence
});
