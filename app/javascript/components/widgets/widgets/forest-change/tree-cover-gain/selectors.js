import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import findIndex from 'lodash/findIndex';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.locationData || null;
const getColors = state => state.colors || null;
const getIndicator = state => state.indicator || null;
const getLocationObject = state => state.locationObject || null;
const getLocationName = state => state.locationName || null;
const getSentences = state => state.config.sentences || null;
const getTitle = state => state.config.title;
const getLocationType = state => state.locationType || null;
const getAllLocation = state => state.allLocation || null;

const getAdminLevel = state => state.adminLevel || null;
const getParentLocation = state => state[state.parentLevel] || null;

const haveData = (data, locationObject) =>
  locationObject &&
  data &&
  data.filter(item => item.id === locationObject.value).length;

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
    getLocation,
    getAllLocation,
    getLocationObject,
    getLocationName,
    getLocationsMeta,
    getColors
  ],
  (
    data,
    settings,
    location,
    allLocation,
    locationObject,
    currentLabel,
    meta,
    colors
  ) => {
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
      const locationMeta = meta && meta.find(l => d.id === l.value);
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
    if (location.adm0) {
      const locationIndex = findIndex(
        dataTrimmed,
        d => d.id === locationObject.value
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
    const { payload, query, type } = allLocation;

    return dataTrimmed.map(d => ({
      ...d,
      color: colors.main,
      path: {
        type,
        payload: {
          ...payload,
          type: 'country',
          ...(!payload.adm1 && {
            adm0: d.id
          }),
          ...(payload.adm1 && {
            adm1: payload.adm2 ? payload.adm1 : d.id
          }),
          ...(payload.adm2 && {
            adm2: d.id
          })
        },
        query
      },
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
    getParentLocation,
    getAdminLevel
  ],
  (
    data,
    indicator,
    locationObject,
    currentLabel,
    sentences,
    parent,
    adminLevel
  ) => {
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
    const gain = locationData ? locationData.gain : sumBy(data, 'gain');
    const gainPercent = gain ? 100 * gain / sumBy(data, 'gain') : 0;
    const areaPercent = (locationData && locationData.percentage) || 0;

    const params = {
      location: currentLabel === 'global' ? 'globally' : currentLabel,
      gain: gain < 1 ? `${format('.3r')(gain)}ha` : `${format('.3s')(gain)}ha`,
      indicator: (indicator && indicator.label.toLowerCase()) || 'region-wide',
      percent: areaPercent >= 0.1 ? `${format('.2r')(areaPercent)}%` : '<0.1%',
      gainPercent:
        gainPercent >= 0.1 ? `${format('.2r')(gainPercent)}%` : '<0.1%',
      parent: parent && parent.label
    };

    let sentence = indicator ? withIndicator : initial;
    if (adminLevel === 'region' || adminLevel === 'subRegion') {
      sentence = indicator ? regionWithIndicator : regionInitial;
    } else if (adminLevel === 'global' || adminLevel === 'subRegion') {
      sentence = indicator ? globalWithIndicator : globalInitial;
    }

    return {
      sentence,
      params
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationType],
  (title, type) => {
    let selectedTitle = title.initial;
    if (type === 'global') {
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
