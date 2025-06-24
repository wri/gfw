import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';

// get list data
const getData = (state) => state.data;
const getLocationName = (state) => state.locationLabel;
const getIndicator = (state) => state.indicator;
const getColors = (state) => state.colors;
const getSentences = (state) => state.sentences;
const getTitle = (state) => state.title;

// get lists selected
export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    const { totalArea, totalExtent, extent } = data;
    const parsedData = [
      {
        label: 'Intact Forest',
        value: extent,
        color: colors.intactForest,
        percentage: (extent / totalArea) * 100,
      },
      {
        label: 'Other Tree Cover',
        value: totalExtent - extent,
        color: colors.otherCover,
        percentage: ((totalExtent - extent) / totalArea) * 100,
      },
      {
        label: 'Non-Forest',
        value: totalArea - totalExtent,
        color: colors.nonForest,
        percentage: ((totalArea - totalExtent) / totalArea) * 100,
      },
    ];
    return parsedData;
  }
);

export const parseSentence = createSelector(
  [parseData, getLocationName, getIndicator, getSentences],
  (parsedData, locationName, indicator, sentences) => {
    if (!parsedData) return null;
    const { initial, withIndicator, noIntact, noIntactWithIndicator } =
      sentences;
    const totalExtent = parsedData
      .map((d) => d.value)
      .reduce((sum, d) => sum + d);
    const intactData = parsedData.find(
      (d) => d.label === 'Intact Forest'
    ).value;
    const intactPercentage = intactData && (intactData / totalExtent) * 100;
    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;

    const params = {
      location: locationName !== 'global' ? `${locationName}'s` : locationName,
      indicator: indicatorLabel,
      percentage: formatNumber({ num: intactPercentage, unit: '%' }),
    };

    let sentence = indicator ? withIndicator : initial;
    if (intactPercentage === 0) {
      sentence = indicator ? noIntactWithIndicator : noIntact;
    }

    return {
      sentence,
      params,
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.initial;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle,
});
