import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationNames = state => state.locationNames;
const getActiveIndicator = state => state.activeIndicator;
const getIndicatorWhitelist = state => state.countryWhitelist;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getSettings, getIndicatorWhitelist, getColors],
  (data, settings, whitelist, colors) => {
    if (isEmpty(data) || isEmpty(whitelist)) return null;
    const { totalArea, totalExtent, extent } = data;
    const colorRange = getColorPalette(colors.ramp, 2);
    const secondaryExtent = totalExtent - extent < 0 ? 0 : totalExtent - extent;
    const parsedData = [
      {
        label: 'Primary Forest',
        value: extent,
        color: colorRange[0],
        percentage: extent / totalArea * 100
      },
      {
        label: 'Other Tree Cover',
        value: secondaryExtent,
        color: colorRange[1],
        percentage: secondaryExtent / totalArea * 100
      },
      {
        label: 'Non-Forest',
        value: totalArea - totalExtent,
        color: colors.nonForest,
        percentage: (totalArea - totalExtent) / totalArea * 100
      }
    ];
    return parsedData;
  }
);

export const getSentence = createSelector(
  [parseData, getSettings, getLocationNames, getActiveIndicator, getSentences],
  (parsedData, settings, locationNames, indicator, sentences) => {
    if (!parsedData || !locationNames) return null;
    const {
      initial,
      lessThan,
      withIndicator,
      lessThanWithIndicator
    } = sentences;
    const locationLabel =
      locationNames && locationNames.current && locationNames.current.label;
    const totalExtent = parsedData
      .map(d => d.value)
      .reduce((sum, d) => sum + d);
    const primaryPercentage =
      parsedData.find(d => d.label === 'Primary Forest').value /
      totalExtent *
      100;

    let indicatorLabel = indicator.label;
    switch (indicator.value) {
      case 'primary_forest__mining':
        indicatorLabel = 'Mining concessions';
        break;
      case 'primary_forest__landmark':
        indicatorLabel = 'Indigenous lands';
        break;
      case 'primary_forest__wdpa':
        indicatorLabel = 'Protected areas';
        break;
      default:
        indicatorLabel = 'Primary forests';
    }

    const params = {
      location: locationLabel,
      indicator: indicatorLabel,
      percentage:
        primaryPercentage < 0.1
          ? '0.1%'
          : `${format('.0f')(primaryPercentage)}%`,
      primary: 'primary forest'
    };

    let sentence =
      indicator.value === 'primary_forest' ? initial : withIndicator;
    if (primaryPercentage < 0.01) {
      sentence =
        indicator.value === 'primary_forest' ? lessThan : lessThanWithIndicator;
    }
    return {
      sentence,
      params
    };
  }
);
