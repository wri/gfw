import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

const getData = state => state.data || null;
const getAdm0 = state => state.adm0 || null;
const getColors = state => state.colors || null;
const getLocationName = state => state.locationLabel || null;
const getPeriod = state => state.settings.period || null;
const getSentences = state => state.sentences;
const getTitle = state => state.title;

export const getSortedData = createSelector([getData], data => {
  if (!data || !data.length) return null;
  return sortByKey(uniqBy(data, 'iso'), 'rate', true).map((d, i) => ({
    ...d,
    rank: i + 1
  }));
});

export const parseData = createSelector(
  [getSortedData, getAdm0, getColors],
  (data, adm0, colors) => {
    if (!data || !data.length) return null;
    let dataTrimmed = data;
    if (adm0) {
      const locationIndex = findIndex(data, d => d.iso === adm0);
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

    return dataTrimmed.map(d => ({
      ...d,
      label: d.name,
      color: colors.main,
      value: d.rate
    }));
  }
);

export const parseSentence = createSelector(
  [getSortedData, parseData, getPeriod, getSentences, getLocationName, getAdm0],
  (sortedData, data, period, sentences, locationName, adm0) => {
    if (!data || !data.length) return null;
    const { initial, noReforest, globalInitial } = sentences;
    const countryData = data.find(d => adm0 === d.iso) || null;

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
      rate: `${format(formatType)(rate)}ha`
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
