import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import moment from 'moment';

// get list data
const getData = state => state.data;
const getLocationName = state => state.locationLabel;
const getOptionsSelected = state => state.optionsSelected;
const getIndicator = state => state.indicator;
const getColors = state => state.colors;
const getSentences = state => state.sentences;
const getTitle = state => state.title;
const getSettings = state => state.settings;

// get lists selected
export const parseData = createSelector(
  [getData, getColors, getIndicator, getSettings],
  (data, colors, indicator, settings) => {
    if (isEmpty(data)) return null;

    const { weeks } = settings;
    const filterDate = moment().subtract(weeks, 'weeks');
    const filterYear = filterDate.year();
    const filterWeek = filterDate.isoWeek();

    let { fireCountIn, fireCountAll } = data;
    fireCountIn = fireCountIn
      .filter(a => a.alert__year > filterYear || a.alert__week >= filterWeek)
      .reduce((acc, n) => acc + n.count, 0);

    fireCountAll = fireCountAll
      .filter(a => a.alert__year > filterYear || a.alert__week >= filterWeek)
      .reduce((acc, n) => acc + n.count, 0);

    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;
    const fireCountOutside =
      fireCountAll - fireCountIn > 0 ? fireCountAll - fireCountIn : 0;
    const parsedData = [
      {
        label: `Fire alerts in ${indicatorLabel}`,
        value: fireCountIn,
        color: colors.main,
        unit: 'counts',
        percentage: fireCountAll > 0 ? fireCountIn / fireCountAll * 100 : 0
      },
      {
        label: `Fire alerts outside ${indicatorLabel}`,
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
  [parseData, getOptionsSelected, getLocationName, getIndicator, getSentences],
  (parsedData, optionsSelected, locationName, indicator, sentences) => {
    if (!parsedData || !optionsSelected || !locationName) return null;
    const { withInd } = sentences;
    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;
    const timeFrame = optionsSelected.weeks;
    const fireswithinper = parsedData[0].percentage;

    const params = {
      timeframe: timeFrame && timeFrame.label,
      location:
        locationName !== 'global' && indicatorLabel !== null
          ? locationName
          : '',
      indicator: indicatorLabel,
      perfireswithin: `${format('.2r')(fireswithinper)}%`
    };
    const sentence = indicator ? withInd : '';
    return {
      sentence,
      params
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getIndicator],
  (title, indicator) => {
    const indicatorLabel = indicator && indicator.label ? indicator.label : '';
    const selectedTitle = title.replace('{indicator}', indicatorLabel);
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
