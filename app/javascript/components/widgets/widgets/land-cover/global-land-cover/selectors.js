import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';
import endsWith from 'lodash/endsWith';

import globalLandCoverCategories from 'data/global-land-cover-categories.json';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getCurrentLocation = state => state.currentLabel;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    let keys = [];
    globalLandCoverCategories.forEach(c => {
      keys = keys.concat(c.classes);
    });
    const dataGrouped = [];
    keys.forEach((k, i) => {
      dataGrouped[i] = {
        key: k,
        value: sumBy(data, k)
      };
    });
    const total = sumBy(dataGrouped, 'value');
    const dataFiltered = dataGrouped.filter(d => d.value);
    const dataMerged = [];
    globalLandCoverCategories.forEach((d, i) => {
      dataMerged[i] = {
        ...d,
        value: sumBy(
          dataFiltered.filter(o => d.classes.indexOf(o.key) > -1),
          'value'
        )
      };
    });
    const dataParsed = dataMerged.filter(el => el.value !== 0).map(el => ({
      ...el,
      percentage: 100 * el.value / total,
      area_ha: el.value * 300 * 300 / 1e4,
      color: colors.categories[el.label]
    }));
    return sortByKey(dataParsed.filter(d => d !== null), 'area_ha', true);
  }
);

export const getSentence = createSelector(
  [getData, parseData, getSettings, getCurrentLocation, getSentences],
  (rawData, data, settings, currentLabel, sentences) => {
    if (isEmpty(data) || !sentences) return null;
    const { initialSpecies, singleSpecies, initialTypes } = sentences;
    const top =
      settings.type === 'bound2' ? data.slice(0, 2) : data.slice(0, 1);
    const areaPerc = 100 * sumBy(top, 'value') / rawData.totalArea;
    const topExtent = sumBy(top, 'value');
    const otherExtent = sumBy(data.slice(2), 'value');
    const params = {
      location: currentLabel,
      firstSpecies: top[0].label.toLowerCase(),
      secondSpecies: top.length > 1 && top[1].label.toLowerCase(),
      type: settings.type === 'bound2' ? 'species' : 'type',
      extent:
        topExtent < 1
          ? `${format('.3r')(topExtent)}ha`
          : `${format('.3s')(topExtent)}ha`,
      other:
        otherExtent < 1
          ? `${format('.3r')(otherExtent)}ha`
          : `${format('.3s')(otherExtent)}ha`,
      count: data.length - top.length,
      topType: `${top[0].label}${endsWith(top[0].label, 's') ? '' : 's'}`,
      percent: areaPerc >= 0.1 ? `${format('.2r')(areaPerc)}%` : '<0.1%'
    };
    const sentence =
      settings.type === 'bound1'
        ? initialTypes
        : `${top.length > 1 ? initialSpecies : singleSpecies}`;

    return {
      sentence,
      params
    };
  }
);
