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
    const intactPercentage =
      parsedData.find(d => d.label === 'Intact Forest').value /
      totalExtent *
      100;
    let indicatorLabel = indicator.label;
    switch (indicator.value) {
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
      location: locationLabel,
      indicator: indicatorLabel,
      percentage:
        intactPercentage < 0.1 ? '0.1%' : `${format('.0f')(intactPercentage)}%`,
      intact: 'intact forest'
    };

    let sentence = indicator.value === 'ifl_2013' ? initial : withIndicator;
    if (intactPercentage < 0.01) {
      sentence =
        indicator.value === 'ifl_2013' ? lessThan : lessThanWithIndicator;
    }
    return {
      sentence,
      params
    };
  }
);
