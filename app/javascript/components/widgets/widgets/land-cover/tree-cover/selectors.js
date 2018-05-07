import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getCurrentLocation = state => state.currentLabel;
const getIndicator = state => state.indicator || null;
const getWhitelists = state => state.countryWhitelist;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getSettings, getWhitelists, getColors, getCurrentLocation],
  (data, settings, whitelist, colors, currentLabel) => {
    if (isEmpty(data)) return null;
    const { totalArea, cover, plantations } = data;
    const { indicator } = settings;
    const hasPlantations =
      !currentLabel || Object.keys(whitelist).indexOf('plantations') > -1;
    const colorRange = getColorPalette(colors.ramp, hasPlantations ? 2 : 1);
    const parsedData = [
      {
        label:
          hasPlantations && indicator === 'gadm28'
            ? 'Natural Forest'
            : 'Tree cover',
        value: cover - plantations,
        color: colorRange[0],
        percentage: (cover - plantations) / totalArea * 100
      },
      {
        label: 'Non-Forest',
        value: totalArea - cover,
        color: colors.nonForest,
        percentage: (totalArea - cover) / totalArea * 100
      }
    ];
    if (indicator === 'gadm28' && hasPlantations) {
      parsedData.splice(1, 0, {
        label: 'Tree plantations',
        value: plantations,
        color: colorRange[1],
        percentage: plantations / totalArea * 100
      });
    }
    return parsedData;
  }
);

export const getSentence = createSelector(
  [getData, getSettings, getCurrentLocation, getIndicator, getSentences],
  (data, settings, currentLabel, indicator, sentences) => {
    if (!data || !sentences) return null;
    const {
      initial,
      withIndicator,
      globalInitial,
      globalWithIndicator
    } = sentences;
    const params = {
      year: settings.extentYear,
      location: currentLabel || 'global',
      indicator: indicator && indicator.label,
      value: `${format('.3s')(data.cover)}ha`
    };
    let sentence = indicator ? withIndicator : initial;
    if (!currentLabel) {
      sentence = indicator ? globalWithIndicator : globalInitial;
    }
    return { sentence, params };
  }
);
