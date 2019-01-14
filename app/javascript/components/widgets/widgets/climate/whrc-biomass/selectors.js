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
const getSentences = state => state.config && state.config.sentences;
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

    return dataTrimmed.map((d, i) => ({
      ...d,
      label: locationsDict[d.iso],
      color: colors.density,
      key: `${d.iso}-${i}`,
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
  [getData, getLocationName, getSentences, getLocationDict],
  (data, location, sentences, locationsDict) => {
    if (!sentences || isEmpty(data)) return null;

    if (location === 'global') {
      const sorted = sortByKey(data, 'totalbiomass').reverse();

      let biomTop5 = 0;
      let densTop5 = 0;
      const biomTotal = sorted.reduce((acc, next, i) => {
        if (i < 5) {
          biomTop5 += next.totalbiomass;
          densTop5 += next.biomassdensity;
        }
        return acc + next.totalbiomass;
      }, 0);

      const percent = biomTop5 / biomTotal * 100;
      const avgBiomDensity = densTop5 / 5;

      return {
        sentence: sentences.global,
        params: {
          X: formatNumber({ num: percent, unit: '%' }),
          Y: formatNumber({ num: avgBiomDensity, unit: 't/ha' })
        }
      };
    }
    const iso = Object.keys(locationsDict).find(
      key => locationsDict[key] === location
    );
    const region = data.find(item => item.iso === iso);
    const { biomassdensity, totalbiomass } = region;
    return {
      sentence: sentences.initial,
      params: {
        location,
        biomassDensity: formatNumber({ num: biomassdensity, unit: 't/ha' }),
        totalBiomass: formatNumber({ num: totalbiomass, unit: 't' })
      }
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
