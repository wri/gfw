import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';
import endsWith from 'lodash/endsWith';

import globalLandCoverCategories from 'data/global-land-cover-categories.json';
import globalLandCoverClasses from 'data/global-land-cover-classes.json';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getCurrentLocation = state => state.currentLabel;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getSettings, getColors],
  (data, settings, colors) => {
    if (isEmpty(data)) return null;

    const areas = globalLandCoverCategories;
    let total = 0;
    let other = 0;
    data.forEach(row => {
      Object.keys(row).forEach(key => {
        if (globalLandCoverClasses[key]) {
          areas[globalLandCoverClasses[key]].value += row[key];
          total += row[key];
        }
      });
    });
    areas.forEach((item, key) => {
      if (item.value / total >= 0.001) {
        areas[key] = {
          ...item,
          percentage: 100 * item.value / total,
          area_ha: item.value * 300 * 300 * 10000,
          color: colors.categories[item.label]
        };
      } else if (key !== 0) {
        other += item.value;
        areas[key] = null;
      }
    });
    if (!other) {
      areas[0] = {
        ...areas[0],
        value: other,
        percentage: 100 * other / total,
        area_ha: other * 300 * 300 * 10000,
        color: colors.categories.Other
      };
    } else {
      areas.splice(0, 1);
    }
    return sortByKey(areas.filter(d => d !== null), 'area_ha', true);
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
