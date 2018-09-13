import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import findIndex from 'lodash/findIndex';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

import { getAdminPath } from '../../../utils';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.location || null;
const getQuery = state => state.query || null;
const getLocationsMeta = state =>
  state[state.adminKey] || state.countries || null;
const getColors = state => state.colors || null;
const getIndicator = state => state.indicator || null;
const getCurrentLocation = state => state.currentLocation || null;
const getCurrentLabel = state => state.currentLabel || null;
const getAdminLevel = state => state.adminLevel || null;
const getSentences = state => state.config.sentences || null;
const getParentLocation = state => state[state.parentLevel] || null;

const haveData = (data, currentLocation) =>
  data.filter(item => item.id === currentLocation.value).length;

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
    getQuery,
    getCurrentLocation,
    getCurrentLabel,
    getLocationsMeta,
    getColors
  ],
  (
    data,
    settings,
    location,
    query,
    currentLocation,
    currentLabel,
    meta,
    colors
  ) => {
    if (
      !data ||
      !data.length ||
      (currentLabel !== 'global' && !haveData(data, currentLocation))
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
    if (location.country) {
      const locationIndex = findIndex(
        dataTrimmed,
        d => d.id === currentLocation.value
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
      path: getAdminPath({
        ...location,
        country: location.region && location.country,
        query,
        id: d.id
      }),
      value: settings.unit === 'ha' ? d.gain : d.percentage
    }));
  }
);

export const getSentence = createSelector(
  [
    getSortedData,
    getIndicator,
    getCurrentLocation,
    getCurrentLabel,
    getSentences,
    getParentLocation,
    getAdminLevel
  ],
  (
    data,
    indicator,
    currentLocation,
    currentLabel,
    sentences,
    parent,
    adminLevel
  ) => {
    if (
      !data ||
      !data.length ||
      (currentLabel !== 'global' && !haveData(data, currentLocation))
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
      currentLocation && data.find(l => l.id === currentLocation.value);
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
