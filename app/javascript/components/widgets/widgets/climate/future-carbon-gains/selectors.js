import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getSentences = state => state.config && state.config.sentences;

export const parseData = createSelector([getData], data => {
  if (isEmpty(data)) return null;
  return data;
});

export const parseConfig = createSelector([], () => ({
  height: 250,
  xKey: '',
  yKeys: {
    bars: {
      area: {
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
