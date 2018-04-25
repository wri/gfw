import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationNames = state => state.locationNames;
const getActiveIndicator = state => state.activeIndicator;
const getWhitelists = state => state.whitelists;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getSettings, getWhitelists, getColors],
  (data, settings, whitelists, colors) => {
    if (isEmpty(data) || isEmpty(whitelists)) return null;
    const { totalArea, cover, plantations } = data;
    const { indicator } = settings;
    const hasPlantations =
      Object.keys(whitelists.countryWhitelist).indexOf('plantations') > -1;
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
  [getData, getSettings, getLocationNames, getActiveIndicator, getSentences],
  (data, settings, locationNames, indicator, sentences) => {
    if (!data || !indicator || !sentences) return null;
    const { initial, withIndicator } = sentences;
    const locationLabel =
      locationNames && locationNames.current && locationNames.current.label;
    const params = {
      year: settings.extentYear,
      location: locationLabel,
      indicator: indicator.label,
      value: format('.3s')(data.cover)
    };

    return {
      sentence: indicator.value !== 'gadm28' ? withIndicator : initial,
      params
    };
  }
);
