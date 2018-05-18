import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getCurrentLocation = state => state.currentLabel;
const getIndicator = state => state.indicator || null;
const getWhitelist = state => state.countryWhitelist;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getSettings, getWhitelist, getColors, getCurrentLocation],
  (data, settings, whitelist, colors, currentLabel) => {
    if (isEmpty(data)) return null;
    const { totalArea, totalExtent, extent, plantations } = data;
    const hasPlantations =
      !currentLabel || whitelist.indexOf('plantations') > -1;
    const colorRange = getColorPalette(colors.ramp, hasPlantations ? 3 : 2);
    const parsedData = [
      {
        label: 'Intact Forest',
        value: extent,
        color: colorRange[0],
        percentage: extent / totalArea * 100
      },
      {
        label: 'Other Tree Cover',
        value: totalExtent - extent,
        color: colorRange[1],
        percentage: (totalExtent - extent) / totalArea * 100
      },
      {
        label: 'Non-Forest',
        value: totalArea - totalExtent,
        color: colors.nonForest,
        percentage: (totalArea - totalExtent) / totalArea * 100
      }
    ];
    if (currentLabel && hasPlantations) {
      parsedData.splice(2, 0, {
        label: 'Plantations',
        value: plantations,
        color: colorRange[2],
        percentage: plantations / totalArea * 100
      });
    }
    return parsedData;
  }
);

export const getSentence = createSelector(
  [parseData, getSettings, getCurrentLocation, getIndicator, getSentences],
  (parsedData, settings, currentLabel, indicator, sentences) => {
    if (!parsedData) return null;
    const {
      initial,
      withIndicator,
      globalInitial,
      globalWithIndicator
    } = sentences;
    const totalExtent = parsedData
      .filter(d => d.label !== 'Non-Forest')
      .map(d => d.value)
      .reduce((sum, d) => sum + d);
    const intactData = parsedData.find(d => d.label === 'Intact Forest').value;
    const intactPercentage = intactData && intactData / totalExtent * 100;
    let indicatorLabel = indicator && indicator.label;
    switch (indicator && indicator.value) {
      case 'ifl_2013__mining':
        indicatorLabel = 'Mining concessions';
        break;
      case 'ifl_2013__wdpa':
        indicatorLabel = 'Protected areas';
        break;
      default:
        indicatorLabel = 'Intact forest';
    }
    const params = {
      location: currentLabel || 'global',
      indicator: indicatorLabel,
      percentage:
        intactPercentage < 0.1
          ? '<0.1%'
          : `${format('.2r')(intactPercentage)}%`,
      intact: 'intact forest'
    };

    let sentence =
      indicator && indicator.value === 'ifl_2013' ? initial : withIndicator;

    if (!currentLabel) {
      sentence =
        indicator && indicator.value === 'ifl_2013'
          ? globalInitial
          : globalWithIndicator;
    }
    return {
      sentence,
      params
    };
  }
);
