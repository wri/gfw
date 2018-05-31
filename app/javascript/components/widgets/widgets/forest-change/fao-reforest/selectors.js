import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

const getData = state => state.data || null;
const getLocation = state => state.payload || null;
const getColors = state => state.colors || null;
const getCurrentLocation = state => state.currentLabel || null;
const getSettings = state => state.settings || null;
const getPeriod = state => state.period || null;
const getSentences = state => state.config && state.config.sentences;

export const getSortedData = createSelector([getData], data => {
  if (!data || !data.length) return null;
  return sortByKey(uniqBy(data, 'iso'), 'rate', true).map((d, i) => ({
    ...d,
    rank: i + 1
  }));
});

export const parseData = createSelector(
  [getSortedData, getLocation, getColors],
  (data, location, colors) => {
    if (!data || !data.length) return null;
    const locationIndex = findIndex(data, d => d.iso === location.country);
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
    return dataTrimmed.map(d => ({
      ...d,
      label: d.name,
      color: colors.main,
      path: `/dashboards/country/${d.iso}`,
      value: d.rate
    }));
  }
);

export const getSentence = createSelector(
  [
    getSortedData,
    parseData,
    getLocation,
    getSettings,
    getPeriod,
    getSentences,
    getCurrentLocation
  ],
  (sortedData, data, location, settings, period, sentences, currentLabel) => {
    if (!data || !data.length) return null;
    const { initial, noReforest, globalInitial } = sentences;
    const countryData = data.find(d => location.country === d.iso) || null;

    let globalRate = 0;
    Object.keys(sortedData).forEach(k => {
      globalRate += sortedData[k].rate;
    });
    const rate =
      currentLabel === 'global' ? globalRate : countryData && countryData.value;

    let sentence = globalInitial;
    if (currentLabel !== 'global') {
      sentence = countryData && countryData.value > 0 ? initial : noReforest;
    }

    const params = {
      location: currentLabel,
      year: period && period.label,
      rate:
        rate < 1 ? `${format('.3r')(rate)}ha/yr` : `${format('.3s')(rate)}ha/yr`
    };

    return {
      sentence,
      params
    };
  }
);
