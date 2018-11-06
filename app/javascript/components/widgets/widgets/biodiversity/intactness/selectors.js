import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

// get list data
/*
const getLoss = state => (state.data && state.data.loss) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getLocationName = state => state.locationName || null;
const getIndicator = state => state.indicator || null;
const getSimple = state => state.simple || false;
const getIsTropical = state => state.isTropical || false;
*/
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentence;
const getData = state => state.data && state.data;

const normalize = (type, d) => {
  if (type === 'intactness') {
    return {
      ...d,
      int: -d.int / d.area
    };
  } else if (type === 'significance') {
    return {
      ...d,
      sig: Math.log10(d.sig / d.area)
    };
  }
  return null;
};

export const parsePayload = () => {};

// get lists selected
export const parseData = createSelector([getData], data => {
  if (!data || isEmpty(data)) return null;
  const breaks_i = {
    // upper boundaries
    '0th': 0.002343949,
    '10th': 0.008821356,
    '25th': 0.03595682,
    '75th': 0.04679092,
    '90th': 1
  };
  const percentiles = [
    { name: 'Very low', data: [], count: 0 },
    { name: 'Low', data: [], count: 0 },
    { name: 'Normal', data: [], count: 0 },
    { name: 'High', data: [], count: 0 },
    { name: 'Very high', data: [], count: 0 }
  ];

  data.forEach(d => {
    const datapoint = normalize('intactness', d);

    for (let i = 0; i < Object.keys(breaks_i).length; i++) {
      const key = Object.keys(breaks_i)[i];
      if (datapoint.int < breaks_i[key]) {
        percentiles[i].data.push(datapoint);
        percentiles[i].count += 1;
        break;
      }
    }
  });
  // eslint-disable-next-line no-console
  console.log(percentiles);
  return percentiles;
});

export const parseConfig = createSelector([getColors], colors => ({
  height: 250,
  xKey: 'name',
  yKeys: {
    bars: {
      count: {
        fill: colors.main,
        background: false
      }
    }
  }
}));

export const parseSentence = createSelector([getSentences], sentence => ({
  sentence: sentence.initial
}));

export default createStructuredSelector({
  data: parseData,
  dataConfig: parseConfig,
  sentence: parseSentence
});
