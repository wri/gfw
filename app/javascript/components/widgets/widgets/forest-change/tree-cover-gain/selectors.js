import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import findIndex from 'lodash/findIndex';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.payload || null;
const getLocationsMeta = state =>
  state[state.adminKey] || state.countries || null;
const getColors = state => state.colors || null;
const getIndicator = state => state.indicator || null;
const getCurrentLocation = state => state.currentLocation || null;
const getCurrentLabel = state => state.currentLabel || null;
const getAdminLevel = state => state.adminLevel || null;
const getSentences = state => state.config.sentences || null;
const getParentLocation = state => state[state.parentLevel] || null;

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
    getCurrentLocation,
    getLocationsMeta,
    getColors
  ],
  (data, settings, location, currentLocation, meta, colors) => {
    if (!data || !data.length) return null;
    const locationIndex = findIndex(data, d => d.id === currentLocation.value);
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
    const dataTrimmed = data.slice(trimStart, trimEnd);
    return dataTrimmed.map(d => {
      const locationData = meta && meta.find(l => d.id === l.value);
      let path = '/dashboards/country/';
      if (location.subRegion) {
        path += `${location.country}/${location.region}/${d.id}`;
      } else if (location.region) {
        path += `${location.country}/${d.id}`;
      } else {
        path += d.id;
      }

      return {
        ...d,
        label: (locationData && locationData.label) || '',
        color: colors.main,
        path,
        value: settings.unit === 'ha' ? d.gain : d.percentage
      };
    });
  }
);

export const getSentence = createSelector(
  [
    getSortedData,
    getSettings,
    getIndicator,
    getCurrentLocation,
    getCurrentLabel,
    getSentences,
    getParentLocation,
    getAdminLevel
  ],
  (
    data,
    settings,
    indicator,
    currentLocation,
    currentLabel,
    sentences,
    parent,
    adminLevel
  ) => {
    if (!data || !data.length) return null;
    const {
      initial,
      withIndicator,
      regionInitial,
      regionWithIndicator
    } = sentences;
    const locationData =
      currentLocation && data.find(l => l.id === currentLocation.value);
    const gain = locationData ? locationData.gain : sumBy(data, 'gain');
    const globalPercent = gain ? 100 * gain / sumBy(data, 'gain') : 0;
    const areaPercent = (locationData && locationData.percentage) || 0;

    const params = {
      location: currentLabel === 'global' ? 'globally' : currentLabel,
      gain: `${format('.3s')(gain)}ha`,
      indicator: (indicator && indicator.label.toLowerCase()) || 'region-wide',
      percent: areaPercent >= 0.1 ? `${format('.1f')(areaPercent)}%` : '<0.1%',
      globalPercent:
        globalPercent >= 0.1 ? `${format('.1f')(globalPercent)}%` : '<0.1%',
      extentYear: settings.extentYear,
      parent: parent && parent.label
    };

    let sentence = indicator ? withIndicator : initial;
    if (adminLevel === 'region' || adminLevel === 'subRegion') {
      sentence = indicator ? regionWithIndicator : regionInitial;
    }

    return {
      sentence,
      params
    };
  }
);
