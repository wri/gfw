import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';

// get list data
const getData = state => state.data && state.data;
const getLocationName = state => state.locationName || null;
const getSentences = state => state.config && state.config.sentence;

export const parseData = createSelector([getData], data => data);

export const parseConfig = createSelector([], () => ({
  height: 150,
  xKey: '',
  yKeys: {}
}));

export const parseSentence = createSelector(
  [getData, getLocationName, getSentences],
  (data, location, sentence) => {
    if (!sentence || isEmpty(data)) return null;
    const { biomassDensity, totalBiomass } = data;

    const params = {
      location,
      biomassDensity: formatNumber({ num: biomassDensity, unit: 't/ha' }),
      totalBiomass: formatNumber({ num: totalBiomass, unit: 't' })
    };
    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
