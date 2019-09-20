import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import { formatNumber } from 'utils/format';
import { sortByKey } from 'utils/data';

// get list data
const getData = state => state.data;
const getLocationName = state => state.locationLabel;
const getAdm0 = state => state.adm0;
const getLocationDict = state => state.childData;
const getLocationObject = state => state.location;
const getSentences = state => state.sentences;
const getTitle = state => state.title;
const getColors = state => state.colors;
const getSettings = state => state.settings;

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
    getAdm0,
    getLocationDict,
    getLocationObject,
    getSettings
  ],
  (data, colors, adm0, locationsDict, locationObj, settings) => {
    if (isEmpty(data) || !locationsDict) return null;

    let dataTrimmed = data.map((d, i) => ({
      ...d,
      rank: i + 1
    }));

    let key;
    if (data[0].admin_2) key = 'admin_2';
    else if (data[0].admin_1) key = 'admin_1';
    else key = 'iso';

    if (adm0) {
      const locationIndex = locationObj
        ? findIndex(data, d => d[key] === locationObj.value)
        : -1;
      if (locationIndex === -1) return null;

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

    return dataTrimmed.map((d, i) => ({
      ...d,
      label: locationsDict[d[key]] && locationsDict[d[key]].label,
      path: locationsDict[d[key]] && locationsDict[d[key]].path,
      color: colors.carbon[0],
      key: `${d.iso}-${i}`,
      value: d[settings.variable],
      unit: settings.variable === 'totalbiomass' ? 'tC' : 'tC/ha'
    }));
  }
);

export const parseSentence = createSelector(
  [getData, getLocationName, getSentences, getLocationDict, getSettings],
  (data, location, sentences, locationsDict, settings) => {
    if (!sentences || isEmpty(data)) return null;

    if (location === 'global') {
      const sorted = sortByKey(data, [settings.variable]).reverse();

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

      const value =
        settings.variable === 'totalbiomass'
          ? formatNumber({ num: percent, unit: '%' })
          : formatNumber({ num: avgBiomDensity, unit: 'tC/ha' });

      const labels = {
        biomassdensity: 'soil organic carbon density',
        totalbiomass: 'total carbon storage'
      };

      return {
        sentence: sentences[settings.variable],
        params: {
          label: labels[settings.variable],
          value
        }
      };
    }
    const iso =
      locationsDict &&
      Object.keys(locationsDict).find(key => locationsDict[key] === location);
    const region =
      data &&
      data.find(item => {
        if (item.admin_2) return String(item.admin_2) === iso;
        else if (item.admin_1) return String(item.admin_1) === iso;
        return item.iso === iso;
      });
    if (!region) return null;

    const { biomassdensity, totalbiomass } = region;
    return {
      sentence: sentences.initial,
      params: {
        location,
        biomassDensity: formatNumber({ num: biomassdensity, unit: 'tC/ha' }),
        totalBiomass: formatNumber({ num: totalbiomass, unit: 'tC' })
      }
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.default;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
