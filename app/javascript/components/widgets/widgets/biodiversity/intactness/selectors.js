import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { getColorPalette } from 'utils/data';
import breaks from './percentiles.json';

// get list data
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentence;
const getData = state => state.data && state.data;
const getLocationName = state => state.locationName || null;
const getLocation = state => state.location || null;
const getAllLocation = state => state.allLocation || null;
const getLocationDict = state => state.locationDict || null;
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

const parseData = createSelector(
  [getData, getSettings, getLocationDict, getLocation],
  (data, settings, childLocations, location) => {
    if (isEmpty(data) || isEmpty(childLocations)) {
      return null;
    }
    const { bType } = settings;
    const { adm0, adm1 } = location;

    let locationType;
    if (!adm0 && !adm1) locationType = 'global';
    else if (adm0 && !adm1) locationType = 'country';
    else locationType = 'region';

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
      for (
        let i = 0;
        i < Object.keys(breaks[locationType][bType]).length;
        i++
      ) {
        // get the percentile key (e.g. "10th")
        const key = Object.keys(breaks[locationType][bType])[i];
        // if the datapoint[variable] falls behind the break
        if (datapoint[bType] < breaks[locationType][bType][key]) {
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
  [parseData, getColors, getSettings, getAllLocation],
  (percentiles, colors, settings, location) => {
    if (isEmpty(percentiles)) return null;
    const { percentile } = settings;
    let selectedPercentile;

    if (!percentile) {
      selectedPercentile = percentiles.reduce(
        (min, next) => (next.count > min.count ? next : min),
        percentiles[0]
      );
    } else {
      selectedPercentile = percentiles.filter(p => p.name === percentile)[0];
    }

    const activeIndex = percentiles.findIndex(
      p => p.name === selectedPercentile.name
    );
    const colorRange = getColorPalette(
      colors.ramp,
      percentiles.length
    ).reverse();
    const data = percentiles
      .map((p, i) => ({ color: colorRange[i], ...p }))
      .reverse();
    const { query, type } = location;
    const list = sortBy(selectedPercentile.data, 'label').map(item => ({
      label: item.label,
      color: colorRange[activeIndex],
      path: {
        type,
        payload: { adm0: item.location, type: 'country' },
        query
      }
    }));

    return {
      percentiles: data,
      list,
      selectedPercentile,
      barBackground: {
        activeIndex: data.findIndex(p => p.name === selectedPercentile.name)
      }
    };
  }
);

const parseConfig = createSelector([buildData], data => {
  if (!data) return null;

  return {
    height: 250,
    yKey: 'name',
    xAxis: {
      type: 'number',
      domain: [0, 100],
      unit: '%'
    },
    // default unitFormat expects a number
    unitFormat: text => text,
    xKeys: {
      bars: {
        percent: {
          clickable: true,
          itemColor: true
        }
      }
    },
    yAxis: {
      type: 'category'
    }
  };
});

const parseSentence = createSelector(
  [parseData, getLocationName, getSentences, getSettings],
  (percentiles, location, sentence, settings) => {
    if (isEmpty(percentiles)) return null;
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

    const percentileName =
      selectedPercentile.name && selectedPercentile.name.toLocaleLowerCase();
    const params = {
      location: location === 'global' ? 'the world' : location,
      percent: `${selectedPercentile.percent}%`,
      percentile: percentileName === 'normal' ? 'average' : percentileName,
      variable: bType === 'int' ? 'intactness' : 'significance'
    };
    return {
      sentence: sentence.initial,
      params
    };
  }
);

export default createStructuredSelector({
  dataConfig: parseConfig,
  data: buildData,
  sentence: parseSentence
});
