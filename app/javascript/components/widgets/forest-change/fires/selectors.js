import { createSelector, createStructuredSelector } from 'reselect';
import { format } from 'd3-format';

const getData = state => state.data && state.data.fires;
const getCurrentLocation = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;

export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (!data) return null;

    return [
      {
        label: 'Active fire alerts',
        value: data,
        color: colors.main,
        unit: 'counts'
      }
    ];
  }
);

export const parseSentence = createSelector(
  [parseData, getCurrentLocation, getSentences],
  (data, currentLabel, sentences) => {
    const { initial } = sentences;
    const count = data && data[0].value > 0 ? data[0].value : 'No';
    const params = {
      location: currentLabel,
      count: typeof count === 'number' ? format(',')(count) : count
    };

    return { sentence: initial, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
