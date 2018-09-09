import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getCurrentLocation = state => state.currentLabel;
const getIndicator = state => state.indicator || null;
const getWhitelist = state => state.countryWhitelist;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;

export const isoHasPlantations = createSelector(
  [getWhitelist, getCurrentLocation],
  (whitelist, currentLabel) => {
    const hasPlantations =
      (currentLabel !== 'global' && isEmpty(whitelist)) ||
      whitelist.indexOf('plantations') > -1;
    return hasPlantations;
  }
);

// get lists selected
export const parseData = createSelector(
  [
    getData,
    getWhitelist,
    getColors,
    getCurrentLocation,
    getIndicator,
    isoHasPlantations
  ],
  (data, whitelist, colors, currentLabel, indicator, hasPlantations) => {
    if (isEmpty(data)) return null;
    const { totalArea, totalCover, cover, plantations } = data;
    const otherCover = indicator ? totalCover - cover : 0;
    const plantationsCover = hasPlantations ? plantations : 0;
    const label = indicator ? ` in ${indicator.label}` : '';
    const parsedData = [
      {
        label: hasPlantations
          ? 'Natural Forest'.concat(label)
          : 'Tree Cover'.concat(label),
        value: cover - plantationsCover,
        color: colors.naturalForest,
        percentage: (cover - plantationsCover) / totalArea * 100
      },
      {
        label: 'Non-Forest',
        value: totalArea - cover - otherCover,
        color: colors.nonForest,
        percentage: (totalArea - cover - otherCover) / totalArea * 100
      }
    ];
    if (indicator) {
      parsedData.splice(1, 0, {
        label: hasPlantations ? 'Other forest cover' : 'Other tree cover',
        value: otherCover,
        color: colors.otherCover,
        percentage: otherCover / totalArea * 100
      });
    } else if (!indicator && hasPlantations) {
      parsedData.splice(1, 0, {
        label: 'Plantations',
        value: plantations,
        color: colors.plantedForest,
        percentage: plantations / totalArea * 100
      });
    }
    return parsedData;
  }
);

export const getSentence = createSelector(
  [
    getData,
    getSettings,
    getCurrentLocation,
    getIndicator,
    getSentences,
    isoHasPlantations
  ],
  (data, settings, currentLabel, indicator, sentences, isoPlantations) => {
    if (!data || !sentences) return null;
    const {
      initial,
      hasPlantations,
      noPlantations,
      hasPlantationsInd,
      noPlantationsInd,
      globalInitial,
      globalWithIndicator
    } = sentences;
    const percentCover = indicator
      ? 100 * data.cover / data.totalCover
      : 100 * data.cover / data.totalArea;
    const params = {
      year: settings.extentYear,
      location: currentLabel || 'global',
      indicator: indicator && indicator.label.toLowerCase(),
      percentage:
        percentCover >= 0.1 ? `${format('.2r')(percentCover)}%` : '<0.1%',
      value:
        data.cover < 1
          ? `${format('.3r')(data.cover)}ha`
          : `${format('.3s')(data.cover)}ha`
    };
    let sentence = isoPlantations
      ? initial + hasPlantations
      : initial + noPlantations;
    if (indicator) {
      sentence = isoPlantations
        ? initial + hasPlantationsInd
        : initial + noPlantationsInd;
    }
    if (currentLabel === 'global') {
      sentence = indicator ? globalWithIndicator : globalInitial;
    }
    return { sentence, params };
  }
);
