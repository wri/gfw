import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import { formatNumber } from 'utils/format';

// get list data
const getData = state => state.data && state.data;
const getLocationName = state => state.locationName || null;
const getLocation = state => state.allLocation || null;
const getLocationDict = state => state.locationDict || null;
const getLocationObject = state => state.locationObject || null;
const getSentences = state => state.config && state.config.sentence;
const getColors = state => state.colors || null;

export const parseData = createSelector(
  [getData, getColors, getLocation, getLocationDict, getLocationObject],
  (data, colors, location, locationsDict, locationObj) => {
    if (isEmpty(data)) return null;
    const { ranking } = data;
    let dataTrimmed = ranking.map((d, i) => ({
      ...d,
      rank: i + 1
    }));

    if (location.payload.adm0) {
      const locationIndex = findIndex(
        ranking,
        d => d.iso === locationObj.value
      );
      let trimStart = locationIndex - 2;
      let trimEnd = locationIndex + 3;
      if (locationIndex < 2) {
        trimStart = 0;
        trimEnd = 5;
      }
      if (locationIndex > ranking.length - 3) {
        trimStart = ranking.length - 5;
        trimEnd = ranking.length;
      }
      dataTrimmed = dataTrimmed.slice(trimStart, trimEnd);
    }
    const { query, type } = location;

    return dataTrimmed.map(d =>
      // console.log(d) ||
      ({
        ...d,
        label: locationsDict[d.iso],
        color: colors.main,
        key: d.iso,
        path: {
          type,
          payload: { type: 'country', adm0: d.iso },
          query
        },
        value: d.biomass
      })
    );
  }
);

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
