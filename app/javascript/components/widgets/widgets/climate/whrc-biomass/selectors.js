import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import { formatNumber } from 'utils/format';
import { sortByKey } from 'utils/data';

// get list data
const getData = state => state.data && state.data;
const getLocationName = state => state.locationName || null;
const getLocation = state => state.allLocation || null;
const getLocationDict = state => state.locationDict || null;
const getLocationObject = state => state.locationObject || null;
const getSentences = state => state.config && state.config.sentence;
const getColors = state => state.colors || null;
const getSettings = state => state.settings || null;

const getSortedData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    return sortByKey(data, settings.variable).reverse();
  }
);

export const parseData = createSelector(
  [
    getSortedData,
    getColors,
    getLocation,
    getLocationDict,
    getLocationObject,
    getSettings
  ],
  (data, colors, location, locationsDict, locationObj, settings) => {
    if (isEmpty(data)) return null;

    let dataTrimmed = data.map((d, i) => ({
      ...d,
      rank: i + 1
    }));

    if (location.payload.adm0) {
      const locationIndex = findIndex(data, d => d.iso === locationObj.value);
      let trimStart = locationIndex - 2;
      let trimEnd = locationIndex + 3;
      if (locationIndex < 2) {
        trimStart = 0;
        trimEnd = 5;
      }
      if (locationIndex > data.length - 3) {
        trimStart = data.length - 5;
        trimEnd = data.length;
      }
      dataTrimmed = dataTrimmed.slice(trimStart, trimEnd);
    }
    const { query, type } = location;

    return dataTrimmed.map(d => ({
      ...d,
      label: locationsDict[d.iso],
      color: colors.main,
      key: d.iso,
      path: {
        type,
        payload: { type: 'country', adm0: d.iso },
        query
      },
      value: d[settings.variable]
    }));
  }
);

export const parseSentence = createSelector(
  [getSortedData, getLocationName, getSentences],
  (data, location, sentence) => {
    if (!sentence || isEmpty(data)) return null;
    const { biomassdensity, totalbiomass } = data[0]; // TODO: change this

    const params = {
      location,
      biomassDensity: formatNumber({ num: biomassdensity, unit: 't/ha' }),
      totalBiomass: formatNumber({ num: totalbiomass, unit: 't' })
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
