import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

const getData = state => state.data || null;
const getLocation = state => state.location || null;
const getColors = state => state.colors || null;
const getLocationName = state => state.locationName || null;
const getPeriod = state => state.settings.period || null;
const getSentences = state => state.config && state.config.sentences;
const getTitle = state => state.config.title;
const getAllLocation = state => state.allLocation || null;

export const getSortedData = createSelector([getData], data => {
  if (!data || !data.length) return null;
  return sortByKey(uniqBy(data, 'iso'), 'rate', true).map((d, i) => ({
    ...d,
    rank: i + 1
  }));
});

export const parseData = createSelector(
  [getSortedData, getAllLocation, getColors],
  (data, location, colors) => {
    if (!data || !data.length) return null;
    let dataTrimmed = data;
    if (location.country) {
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
      dataTrimmed = data.slice(trimStart, trimEnd);
    }
    const { query, type } = location;

    return dataTrimmed.map(d => ({
      ...d,
      label: d.name,
      color: colors.main,
      path: {
        type,
        payload: {
          type: 'country',
          adm0: d.iso
        },
        query
      },
      value: d.rate
    }));
  }
);

export const parseSentence = createSelector(
  [
    getSortedData,
    parseData,
    getPeriod,
    getSentences,
    getLocationName,
    getLocation
  ],
  (sortedData, data, period, sentences, locationName, location) => {
    if (!data || !data.length) return null;
    const { initial, noReforest, globalInitial } = sentences;
    const countryData = data.find(d => location.adm0 === d.iso) || null;

    let globalRate = 0;
    Object.keys(sortedData).forEach(k => {
      globalRate += sortedData[k].rate;
    });
    const rate =
      locationName === 'global' ? globalRate : countryData && countryData.value;

    let sentence = globalInitial;
    if (locationName !== 'global') {
      sentence = countryData && countryData.value > 0 ? initial : noReforest;
    }
    const formatType = rate < 1 ? '.3r' : '.3s';

    const params = {
      location: locationName,
      year: period,
      rate: `${format(formatType)(rate)}ha/yr`
    };

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
