import { createSelector } from 'reselect';
import findIndex from 'lodash/findIndex';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';

import { getAdminPath } from '../../../utils';

const getData = state => state.data || null;
const getLocation = state => state.location || null;
const getQuery = state => state.query || null;
const getCurrentLocation = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getSettings = state => state.settings || null;
const getPeriod = state => state.period || null;
const getSentences = state => state.config && state.config.sentences;

export const parseData = createSelector(
  [getData, getLocation, getColors, getQuery],
  (data, location, colors, query) => {
    if (!data || !data.rank) return null;
    const { rank } = data;
    let dataTrimmed = rank;
    if (location.country) {
      const locationIndex = findIndex(rank, d => d.iso === location.country);
      let trimStart = locationIndex - 2;
      let trimEnd = locationIndex + 3;
      if (locationIndex < 2) {
        trimStart = 0;
        trimEnd = 5;
      }
      if (locationIndex > rank.length - 3) {
        trimStart = rank.length - 5;
        trimEnd = rank.length;
      }
      dataTrimmed = rank.slice(trimStart, trimEnd);
    }

    return dataTrimmed.map(d => ({
      ...d,
      label: d.name,
      color: colors.main,
      path: getAdminPath({ query, id: d.iso }),
      value: d.deforest
    }));
  }
);

export const getSentence = createSelector(
  [
    getData,
    getLocation,
    getCurrentLocation,
    getSettings,
    getPeriod,
    getSentences
  ],
  (data, location, currentLabel, settings, period, sentences) => {
    if (!data || !data.fao) return '';
    const {
      initial,
      noDeforest,
      humanDeforest,
      globalInitial,
      globalHuman
    } = sentences;
    const topFao = data.fao.filter(d => d.year === settings.period);
    const { deforest, humdef } = topFao[0];
    const totalDeforest = sumBy(data.rank, 'deforest');
    const rate = currentLabel === 'global' ? totalDeforest : deforest;

    let sentence = humdef ? humanDeforest : initial;
    if (currentLabel === 'global') {
      sentence = humdef ? globalHuman : globalInitial;
    } else if (!deforest) sentence = noDeforest;

    const rateFormat = rate < 1 ? '.3r' : '.3s';
    const humanFormat = humdef < 1 ? '.3r' : '.3s';

    const params = {
      location: currentLabel,
      year: period && period.label,
      rate: `${format(rateFormat)(rate)}ha/yr`,
      human: `${format(humanFormat)(humdef)}ha/yr`
    };

    return {
      sentence,
      params
    };
  }
);
