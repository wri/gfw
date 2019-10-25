import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import findIndex from 'lodash/findIndex';
import { sortByKey } from 'utils/data';
import { formatNumber } from 'utils/format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getAdm0 = state => state.adm0;
const getLocationsMeta = state =>
  (state.adm0 ? state.locationData : state.childData);
const getColors = state => state.colors;
const getIndicator = state => state.indicator;
const getLocationObject = state => state.location;
const getLocationName = state => state.locationLabel;
const getSentences = state => state.sentences;
const getAdminLevel = state => state.adminLevel;
const getTitle = state => state.title;

const haveData = (data, locationObject) =>
  locationObject && data && data.find(item => item.id === locationObject.value);

export const getSortedData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || !data.length) return null;
    return sortByKey(
      uniqBy(data, 'id'),
      settings.unit === 'ha' ? 'gain' : 'percentage',
      true
    ).map((d, i) => ({
      ...d,
      rank: i + 1
    }));
  }
);

export const parseData = createSelector(
  [
    getSortedData,
    getSettings,
    getAdm0,
    getLocationObject,
    getLocationName,
    getLocationsMeta,
    getColors
  ],
  (data, settings, adm0, locationObject, currentLabel, meta, colors) => {
    if (
      !data ||
      !data.length ||
      (currentLabel !== 'global' &&
        locationObject &&
        !haveData(data, locationObject))
    ) {
      return null;
    }

    let dataTrimmed = [];
    data.forEach(d => {
      const locationMeta = meta && meta[d.id];
      if (locationMeta) {
        dataTrimmed.push({
          ...d,
          label: locationMeta.label
        });
      }
    });
    dataTrimmed = dataTrimmed.map((d, i) => ({
      ...d,
      rank: i + 1
    }));
    if (adm0) {
      const locationIndex = findIndex(
        dataTrimmed,
        d => d.id === locationObject && locationObject.value
      );
      let trimStart = locationIndex - 2;
      let trimEnd = locationIndex + 3;
      if (locationIndex < 2) {
        trimStart = 0;
        trimEnd = 5;
      }
      if (locationIndex > dataTrimmed.length - 3) {
        trimStart = dataTrimmed.length - 5;
        trimEnd = dataTrimmed.length;
      }
      dataTrimmed = dataTrimmed.slice(trimStart, trimEnd);
    }

    return dataTrimmed.map(d => ({
      ...d,
      color: colors.main,
      value: settings.unit === 'ha' ? d.gain : d.percentage
    }));
  }
);

export const parseSentence = createSelector(
  [
    getSortedData,
    getIndicator,
    getLocationObject,
    getLocationName,
    getSentences,
    getAdminLevel
  ],
  (data, indicator, locationObject, currentLabel, sentences, adminLevel) => {
    if (
      !data ||
      !data.length ||
      (currentLabel !== 'global' && !haveData(data, locationObject))
    ) {
      return null;
    }
    const {
      initial,
      withIndicator,
      regionInitial,
      regionWithIndicator,
      globalInitial,
      globalWithIndicator
    } = sentences;
    const locationData =
      locationObject && data.find(l => l.id === locationObject.value);
    const gain = locationData ? locationData.gain : sumBy(data, 'gain') || 0;
    const gainPercent = gain ? 100 * gain / sumBy(data, 'gain') || 0 : 0;
    const areaPercent = (locationData && locationData.percentage) || 0;

    const params = {
      location: currentLabel === 'global' ? 'globally' : currentLabel,
      gain: formatNumber({ num: gain, unit: 'ha' }),
      indicator: (indicator && indicator.label.toLowerCase()) || 'region-wide',
      percent: formatNumber({ num: areaPercent, unit: '%' }),
      gainPercent: formatNumber({ num: gainPercent, unit: '%' }),
      parent: locationObject.parentLabel || null
    };

    let sentence = indicator ? withIndicator : initial;
    if (adminLevel === 'adm1' || adminLevel === 'adm2') {
      sentence = indicator ? regionWithIndicator : regionInitial;
    } else if (adminLevel === 'global') {
      sentence = indicator ? globalWithIndicator : globalInitial;
    }

    return {
      sentence,
      params
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.initial;
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
