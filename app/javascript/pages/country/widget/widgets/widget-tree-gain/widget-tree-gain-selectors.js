import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import { sortByKey, getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getColors = state => state.colors || null;
const getIndicator = state => state.indicator || null;
const getLocationNames = state => state.locationNames || null;

export const getSortedData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || !data.length) return null;
    return sortByKey(
      uniqBy(data, 'id'),
      settings.unit === 'ha' ? 'gain' : 'percentage',
      true
    );
  }
);

export const getFilteredData = createSelector(
  [
    getSortedData,
    getSettings,
    getLocation,
    getLocationNames,
    getLocationsMeta,
    getColors
  ],
  (data, settings, location, locationNames, meta, colors) => {
    if (!data || !data.length) return null;
    const locationIndex = findIndex(
      data,
      d => d.id === locationNames.current.value
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
    const colorRange = getColorPalette(
      [colors.darkGreen, colors.lightGreen],
      dataTrimmed.length
    );
    return dataTrimmed.map((d, index) => {
      const locationData = meta.find(l => d.id === l.value);
      let path = '/country/';
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
        color: colorRange[index],
        path,
        value: settings.unit === 'ha' ? d.gain : d.percentage
      };
    });
  }
);

export const getSentence = createSelector(
  [getData, getSettings, getIndicator, getLocationNames],
  (data, settings, indicator, locationNames) => {
    if (!data || !data.length) return null;
    const locationData = data.find(l => l.id === locationNames.current.value);
    const regionPhrase =
      indicator.value === 'gadm28'
        ? '<span>region-wide</span>'
        : `in <span>${indicator && indicator.label.toLowerCase()}</span>`;

    const areaPercent = format('.1f')(locationData.percentage);
    const firstSentence = `From 2001 to 2012, <span>${locationNames.current &&
      locationNames.current.label}</span> gained <strong>${
      locationData.gain ? format('.3s')(locationData.gain) : '0'
    }ha</strong> of tree cover ${regionPhrase}`;
    const secondSentence = locationData.gain
      ? `, equivalent to a <strong>${areaPercent}%</strong> increase relative to <b>${
        settings.extentYear
      }</b> tree cover extent.`
      : '.';

    return `${firstSentence}${secondSentence}`;
  }
);
