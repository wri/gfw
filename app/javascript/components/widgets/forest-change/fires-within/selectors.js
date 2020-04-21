import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getLocationName = state => state.locationLabel;
const getIndicator = state => state.indicator;
const getColors = state => state.colors;
const getSentences = state => state.sentences;
const getTitle = state => state.title;

// get lists selected
export const parseData = createSelector(
  [getData, getColors, getIndicator],
  (data, colors, indicator) => {
    if (isEmpty(data)) return null;
    const { fireCountIn, fireCountAll } = data;
    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;
    const fireCountOutside =
      fireCountAll - fireCountIn > 0 ? fireCountAll - fireCountIn : 0;
    const parsedData = [
      {
        label: `Fires within ${indicatorLabel}`,
        value: fireCountIn,
        color: colors.main,
        unit: 'counts',
        percentage: fireCountAll > 0 ? fireCountIn / fireCountAll * 100 : 0
      },
      {
        label: `Fires outside ${indicatorLabel}`,
        value: fireCountOutside,
        color: colors.otherColor,
        unit: 'counts',
        percentage: fireCountAll > 0 ? fireCountOutside / fireCountAll * 100 : 0
      }
    ];
    return parsedData;
  }
);

export const parseSentence = createSelector(
  [parseData, getLocationName, getIndicator, getSentences],
  (parsedData, locationName, indicator, sentences) => {
    if (!parsedData) return null;
    const { initial } = sentences;

    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;

    const params = {
      location: locationName !== 'global' ? `${locationName}'s` : locationName,
      indicator: indicatorLabel
    };

    const sentence = indicator ? initial : '';
    return {
      sentence,
      params
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
  title: parseTitle
});
