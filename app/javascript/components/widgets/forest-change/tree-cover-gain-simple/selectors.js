import { createSelector, createStructuredSelector } from 'reselect';
import { formatNumber } from 'utils/format';

// get list data
const getGain = state => state.data && state.data.gain;
const getExtent = state => state.data && state.data.extent;
const getSentence = state => state.sentence;
const getLocationName = state => state.locationLabel;

export const parseSentence = createSelector(
  [getGain, getExtent, getSentence, getLocationName],
  (gain, extent, sentence, location) => {
    const gainPerc = (gain && extent && gain / extent * 100) || 0;

    const params = {
      gain: formatNumber({ num: gain, unit: 'ha' }),
      gainPercent: formatNumber({ num: gainPerc, unit: '%' }),
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
