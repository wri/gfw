import { createSelector, createStructuredSelector } from 'reselect';
import { formatNumber } from 'utils/format';

// get list data
const getGain = state => state.data && state.data.gain;
const getSentence = state => state.sentence;
const getLocationName = state => state.locationLabel;

export const parseSentence = createSelector(
  [getGain, getSentence, getLocationName],
  (gain, sentence, location) => {
    if (!gain) return null;

    const params = {
      gain: formatNumber({ num: gain, unit: 'ha' }),
      location
    };

    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  sentence: parseSentence
});
