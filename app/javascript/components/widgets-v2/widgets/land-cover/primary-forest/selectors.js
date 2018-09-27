import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationName = state => state.locationName;
const getIndicator = state => state.indicator || null;
const getColors = state => state.colors;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    const { totalArea, totalExtent, extent } = data;
    const secondaryExtent = totalExtent - extent < 0 ? 0 : totalExtent - extent;
    const parsedData = [
      {
        label: 'Primary Forest',
        value: extent,
        color: colors.primaryForest,
        percentage: extent / totalArea * 100
      },
      {
        label: 'Other Tree Cover',
        value: secondaryExtent,
        color: colors.otherCover,
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

export const parseSentence = createSelector(
  [parseData, getSettings, getLocationName, getIndicator, getSentences],
  (parsedData, settings, locationName, indicator, sentences) => {
    if (!parsedData || !locationName) return null;
    const { initial, withIndicator } = sentences;
    const totalExtent = parsedData
      .filter(d => d.label !== 'Non-Forest')
      .map(d => d.value)
      .reduce((sum, d) => sum + d);
    const primaryData = parsedData.find(d => d.label === 'Primary Forest')
      .value;
    const primaryPercentage = primaryData && primaryData / totalExtent * 100;

    let indicatorLabel = indicator && indicator.label;
    switch (indicator && indicator.value) {
      case 'primary_forest__mining':
        indicatorLabel = 'mining concessions';
        break;
      case 'primary_forest__landmark':
        indicatorLabel = 'indigenous lands';
        break;
      case 'primary_forest__wdpa':
        indicatorLabel = 'protected areas';
        break;
      default:
        indicatorLabel = 'primary forests';
    }

    const params = {
      location: `${locationName}'s`,
      indicator: indicatorLabel,
      percentage:
        primaryPercentage < 0.1
          ? '<0.1%'
          : `${format('.2r')(primaryPercentage)}%`,
      extentYear: settings.extentYear
    };

    const sentence =
      indicator && indicator.value === 'primary_forest'
        ? initial
        : withIndicator;

    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
