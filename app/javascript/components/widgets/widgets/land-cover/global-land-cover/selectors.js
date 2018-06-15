import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

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
  [getData, getColors],
  (data, colors) => {
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
  [parseData, getSettings, getCurrentLocation, getSentences],
  (data, settings, currentLabel, sentences) => {
    if (isEmpty(data) || !sentences) return null;
    const { initial } = sentences;
    const { year } = settings;
    const { label, area_ha } = data[0];
    const params = {
      location: currentLabel,
      year,
      category: label,
      extent: `${format('.3s')(area_ha)}ha`
    };
    return {
      sentence: initial,
      params
    };
  }
);
