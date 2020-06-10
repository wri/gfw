import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import moment from 'moment';
import { hslShift } from 'utils/data';

// get list data
const getData = state => state.data;
const getLocationName = state => state.locationLabel;
const getOptionsSelected = state => state.optionsSelected;
const getIndicator = state => state.indicator;
const getColors = state => state.colors;
const getSentences = state => state.sentences;
const getTitle = state => state.title;

// get lists selected
export const parseData = createSelector(
  [getData, getColors, getIndicator, getLocationName, getOptionsSelected],
  (data, colors, indicator, locationName, options) => {
    if (isEmpty(data)) return null;
    const { weeks } = options;
    let { fireCountIn, fireCountAll } = data;
    const { latest } = data;
    const weekNumber = weeks && weeks.value;
    const filterDate = moment(latest).subtract(weekNumber, 'weeks');
    const filterYear = filterDate.year();
    const filterWeek = filterDate.isoWeek();

    fireCountIn = fireCountIn
      .filter(
        a =>
          (a.year === filterYear && a.week >= filterWeek) || a.year > filterYear
      )
      .reduce((acc, n) => acc + n.count, 0);

    fireCountAll = fireCountAll
      .filter(
        a =>
          (a.year === filterYear && a.week >= filterWeek) || a.year > filterYear
      )
      .reduce((acc, n) => acc + n.count, 0);

    const mainColour = colors.main;
    const otherColour = hslShift(mainColour);

    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;
    const fireCountOutside =
      fireCountAll - fireCountIn > 0 ? fireCountAll - fireCountIn : 0;
    const parsedData = [
      {
        label: indicator
          ? `Fire alerts in ${indicatorLabel}`
          : `Fire alerts in ${locationName}`,
        value: indicator ? fireCountIn : fireCountAll,
        color: mainColour,
        unit: 'counts',
        percentage:
          indicator && fireCountAll > 0 ? fireCountIn / fireCountAll * 100 : 100
      }
    ];
    if (indicator) {
      parsedData.push({
        label: `Fire alerts outside ${indicatorLabel}`,
        value: fireCountOutside,
        color: otherColour,
        unit: 'counts',
        percentage: fireCountAll > 0 ? fireCountOutside / fireCountAll * 100 : 0
      });
    }
    return parsedData;
  }
);

export const parseSentence = createSelector(
  [parseData, getOptionsSelected, getLocationName, getIndicator, getSentences],
  (parsedData, optionsSelected, locationName, indicator, sentences) => {
    if (!parsedData || !optionsSelected || !locationName) return null;
    const {
      globalWithInd,
      withInd,
      noIndicator,
      globalNoIndicator,
      highConfidence
    } = sentences;
    const { confidence } = optionsSelected;
    const indicatorLabel =
      indicator && indicator.label ? indicator.label : null;
    const timeFrame = optionsSelected.weeks;
    const firesWithinPerc = parsedData[0].percentage;
    const totalFires = sumBy(parsedData, 'value');
    const params = {
      timeframe: timeFrame && timeFrame.label,
      location: locationName !== 'global' ? locationName : 'globally',
      indicator: indicatorLabel,
      firesWithinPerc: `${format('.2r')(firesWithinPerc)}%`,
      totalFires: `${format(',')(totalFires)}`
    };
    let sentence = indicator ? withInd : noIndicator;
    if (locationName === 'global') {
      sentence = indicator ? globalWithInd : globalNoIndicator;
    }
    sentence =
      confidence && confidence.value === 'h'
        ? sentence + highConfidence
        : `${sentence}.`;
    return {
      sentence,
      params
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName, getIndicator],
  (title, location, indicator) => {
    const indicatorLabel = indicator && indicator.label ? indicator.label : '';
    const selectedTitle = location === 'global' ? title.global : title.default;
    return selectedTitle.replace('{indicator}', indicatorLabel);
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
