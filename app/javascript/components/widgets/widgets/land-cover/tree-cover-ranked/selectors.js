import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';
import sumBy from 'lodash/sumBy';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.payload || null;
const getLocationsMeta = state => state.countries || null;
const getColors = state => state.colors || null;
const getIndicator = state => state.indicator || null;
const getCurrentLocation = state => state.currentLocation || null;
const getSentences = state => state.config.sentences || null;

export const getSortedData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || !data.length) return null;
    return sortByKey(
      uniqBy(data, 'id'),
      settings.unit === 'ha' ? 'extent' : 'percentage',
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
    if (!data || !data.length || !currentLocation || !meta) return null;
    const locationIndex = findIndex(
      data,
      d =>
        d.id === (currentLocation && currentLocation && currentLocation.value)
    );
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
        value: settings.unit === 'ha' ? d.extent : d.percentage
      };
    });
  }
);

export const getSentence = createSelector(
  [
    getData,
    parseData,
    getSettings,
    getIndicator,
    getCurrentLocation,
    getSentences
  ],
  (rawData, data, settings, indicator, currentLocation, sentences) => {
    if (!data || !data.length || !currentLocation) return null;
    const { initial, withInd } = sentences;
    const locationData =
      currentLocation && data.find(l => l.id === currentLocation.value);
    const extent = locationData && locationData.extent;
    const areaPercent = 100 * extent / sumBy(rawData, 'extent') || 0;

    const params = {
      extentYear: settings.extentYear,
      location: currentLocation.label,
      extent: `${extent ? format('.3s')(extent) : '0'}ha`,
      indicator: indicator && indicator.value,
      percentage:
        areaPercent >= 0.1 ? `${format('.1f')(areaPercent)}%` : '<0.1%'
    };

    const sentence = indicator ? withInd : initial;

    return {
      sentence,
      params
    };
  }
);
