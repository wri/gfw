import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import meanBy from 'lodash/meanBy';
import { format } from 'd3-format';
import { formatNumber } from 'utils/format';

// get list data
const getNetChange = (state) => state.data && state.data.netChange;
const getTitle = (state) => state.title;
const getSettings = (state) => state.settings;
const getLocationLabel = (state) => state.locationLabel;
const getIndicator = (state) => state.indicator;
const getColors = (state) => state.colors;
const getSentence = (state) => state && state.sentence;

const parseData = createSelector(
  [getNetChange, getLocationLabel],
  (data, location) => {
    if (!data || isEmpty(data)) return null;

    const parsedData = data;

    if (isEmpty(parsedData)) return null;

    if (location === 'global') {
      return {
        change: -2.44,
        disturb: 307684115.641,
        gain: 130855151.187,
        loss: 231428936.133,
        net: -100573784.946,
        stable: 3582893990.354,
        totalArea: sumBy(parsedData, 'gfw_area__ha'),
      };
    }

    return {
      change: meanBy(parsedData, 'change'),
      disturb: sumBy(parsedData, 'disturb'),
      gain: sumBy(parsedData, 'gain'),
      loss: sumBy(parsedData, 'loss'),
      net: sumBy(parsedData, 'net'),
      stable: sumBy(parsedData, 'stable'),
      totalArea:
        sumBy(parsedData, 'disturb') +
        sumBy(parsedData, 'gain') +
        sumBy(parsedData, 'loss') +
        sumBy(parsedData, 'stable'),
    };
  }
);

// Transform data for chart
const transformData = createSelector([parseData, getColors], (data, colors) => {
  if (!data || isEmpty(data)) return null;

  const pieContent = [
    {
      label: 'Stable forest',
      property: 'stable',
      color: colors.stable,
    },
    {
      label: 'Gain',
      property: 'gain',
      color: colors.gain,
    },
    {
      label: 'Loss',
      property: 'loss',
      color: colors.loss,
    },
    {
      label: 'Disturbed',
      property: 'disturb',
      color: colors.disturb,
    },
  ];

  return pieContent.map((item) => {
    const value = data[item.property];
    const percentage = (100 * value) / data.totalArea;

    return {
      ...item,
      value,
      percentage,
    };
  });
});

const parseSentence = createSelector(
  [parseData, getSettings, getLocationLabel, getIndicator, getSentence],
  (data, settings, locationLabel, indicator, sentences) => {
    if (!data) return null;
    const {
      globalInitial,
      globalWithIndicator,
      initial,
      withIndicator,
    } = sentences;
    const { startYear, endYear } = settings;
    const { change, net } = data;

    let sentence = indicator ? withIndicator : initial;
    if (locationLabel === 'global') {
      sentence = indicator ? globalWithIndicator : globalInitial;
    }

    const params = {
      indicator: indicator && indicator.label,
      location: locationLabel,
      startYear,
      endYear,
      netChange: formatNumber({ num: net, unit: 'ha' }),
      netChangePerc: `${format('.2r')(change)}%`,
    };

    return {
      sentence,
      params,
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationLabel],
  (title, name) => {
    return name === 'global' ? title.global : title.default;
  }
);

export default createStructuredSelector({
  data: transformData,
  sentence: parseSentence,
  title: parseTitle,
});
