import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getSentences = state => state.config && state.config.sentences;
const getColors = state => state.colors || null;

export const parseData = createSelector([getData], data => {
  if (isEmpty(data)) return null;
  const years = {};
  Object.keys(data).forEach(key =>
    data[key].values // YSF, MASF, Pasture, and Crops arrays
      .forEach(obj => {
        if (years[obj.year]) years[obj.year][key] = obj.value;
        else years[obj.year] = { year: obj.year, [key]: obj.value };
      })
  );
  return Object.values(years);
});

export const parseConfig = createSelector([getColors], colors => ({
  height: 250,
  xKey: 'year',
  yKeys: {
    bars: {
      area: {
        fill: colors.main,
        background: false
      }
    }
  },
  xAxis: {}
}));

export const parseSentence = createSelector(
  [getSettings, getLocationName, getSentences],
  sentences => {
    const { initial } = sentences;
    const params = {};

    return {
      sentence: initial,
      params
    };
  }
);

export const parseTitle = createSelector([], () => 'Test');

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence,
  title: parseTitle
});
