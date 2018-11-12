import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';

// get list data
/*
const getLoss = state => (state.data && state.data.loss) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getIndicator = state => state.indicator || null;
const getSimple = state => state.simple || false;
const getIsTropical = state => state.isTropical || false;
*/
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentence;
const getData = state => state.data && state.data;
const getLocationName = state => state.locationName || null;
const getChildLocationDict = state => state.childLocationDict || null;
const getSettings = state => state.settings || null;

const normalizeInt = d => ({
  ...d,
  int: -d.int / d.area
});

const normalizeSig = d => ({
  ...d,
  sig: Math.log10(d.sig / d.area)
});

export const parsePayload = payload =>
  payload && { percentile: payload.activeLabel };

const breaks = {
  int: {
    // upper boundaries
    '0th': 0.002343949,
    '10th': 0.008821356,
    '25th': 0.03595682,
    '75th': 0.04679092,
    '90th': 1
  },
  sig: {
    '0th': -4.980669,
    '10th': -3.941458,
    '25th': -2.52913,
    '75th': -1.997363,
    '90th': 0
  }
};

const parseData = createSelector(
  [getData, getSettings, getChildLocationDict],
  (data, settings, childLocations) => {
    if (!data || isEmpty(data) || isEmpty(childLocations)) {
      return null;
    }
    const { bType } = settings;

    const percentiles = [
      { name: 'Very low', data: [], count: 0, percent: 0 },
      { name: 'Low', data: [], count: 0, percent: 0 },
      { name: 'Normal', data: [], count: 0, percent: 0 },
      { name: 'High', data: [], count: 0, percent: 0 },
      { name: 'Very high', data: [], count: 0, percent: 0 }
    ];

    data.forEach(d => {
      const datapoint = bType === 'int' ? normalizeInt(d) : normalizeSig(d);

      // foreach percentile division
      for (let i = 0; i < Object.keys(breaks[bType]).length; i++) {
        // get the percentile key (e.g. "10th")
        const key = Object.keys(breaks[bType])[i];
        // if the datapoint[variable] falls behind the break
        if (datapoint[bType] < breaks[bType][key]) {
          // add it to its percentile and update the count
          if (childLocations[datapoint.location]) {
            percentiles[i].data.push({
              ...datapoint,
              label: childLocations[datapoint.location]
            });
          }

          percentiles[i].count += 1;
          // then `break` so it's not also added to next percentiles
          break;
        }
      }
    });

    return percentiles.map(p => ({
      ...p,
      percent: Math.round(p.count / data.length * 100)
    }));
  }
);

const buildData = createSelector(
  [parseData, getColors, getSettings],
  (percentiles, colors, settings) => {
    if (!percentiles || isEmpty(percentiles)) return null;
    const { bType, percentile } = settings;
    let selectedPercentile;

    if (!percentile) {
      selectedPercentile = percentiles.reduce(
        (min, next) => (next.count > min.count ? next : min),
        percentiles[0]
      );
    } else {
      selectedPercentile = percentiles.filter(p => p.name === percentile)[0];
    }

    const list = sortBy(selectedPercentile.data, [bType]).map(item => ({
      label: item.label,
      color: colors.main
    }));

    return { percentiles, list };
  }
);

/*
const backgroundControl = e => {
  // TODO: background function true/false
  // eslint-disable-next-line no-console
  console.log(e);
  return true;
};
*/

const parseConfig = createSelector([getColors], colors => ({
  height: 250,
  xKey: 'name',
  unit: '%',
  yKeys: {
    bars: {
      percent: {
        fill: colors.main
        // backgroundFn: backgroundControl
      }
    }
  }
}));

const parseSentence = createSelector(
  [parseData, getLocationName, getSentences, getSettings],
  (percentiles, location, sentence, settings) => {
    // const { percentiles } = data || {};
    if (!percentiles || isEmpty(percentiles)) return null;
    const { bType, percentile } = settings;

    let selectedPercentile;

    if (!percentile) {
      selectedPercentile = percentiles.reduce(
        (min, next) => (next.count > min.count ? next : min),
        percentiles[0]
      );
    } else {
      selectedPercentile = percentiles.filter(p => p.name === percentile)[0];
    }

    const params = {
      location: location === 'global' ? 'the world' : location,
      percent: `${selectedPercentile.percent}%`,
      percentile: selectedPercentile.name.toLocaleLowerCase(),
      variable: bType === 'int' ? 'intactness' : 'significance'
    };
    return {
      sentence: sentence.initial,
      params
    };
  }
);

export default createStructuredSelector({
  data: buildData,
  dataConfig: parseConfig,
  sentence: parseSentence
});
