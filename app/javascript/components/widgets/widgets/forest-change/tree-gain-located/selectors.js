import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

import { getAdminPath } from '../../../utils';

// get list data
const getGain = state => (state.data && state.data.gain) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocation = state => state.location || null;
const getQuery = state => state.query || null;
const getLocationsMeta = state =>
  (state.location.region ? state.subRegions : state.regions) || null;
const getCurrentLocation = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config.sentences || null;

export const getSortedData = createSelector(
  [
    getGain,
    getExtent,
    getSettings,
    getLocation,
    getQuery,
    getLocationsMeta,
    getColors
  ],
  (data, extent, settings, location, query, meta, colors) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach(d => {
      const region = meta.find(l => d.id === l.value);
      if (region) {
        const locationExtent = extent.filter(l => l.id === d.id);
        const percentage = d.gain / locationExtent[0].extent * 100;
        dataMapped.push({
          label: (region && region.label) || '',
          gain: d.gain,
          percentage,
          value: settings.unit === 'ha' ? d.gain : percentage,
          path: getAdminPath({ ...location, query, id: d.id }),
          color: colors.main
        });
      }
    });
    return sortByKey(dataMapped, 'gain');
  }
);

export const parseData = createSelector([getSortedData], data => {
  if (!data || !data.length) return null;
  return sortByKey(uniqBy(data, 'label'), 'value', true);
});

export const getSentence = createSelector(
  [
    getSortedData,
    parseData,
    getSettings,
    getOptions,
    getLocation,
    getIndicator,
    getCurrentLocation,
    getSentences
  ],
  (
    data,
    sortedData,
    settings,
    options,
    location,
    indicator,
    currentLabel,
    sentences
  ) => {
    if (!data || !options || !currentLabel) return null;
    const {
      initial,
      withIndicator,
      initialPercent,
      withIndicatorPercent
    } = sentences;
    const totalGain = sumBy(data, 'gain');
    const topRegion = (sortedData && sortedData.length && sortedData[0]) || {};
    const avgGainPercentage = sumBy(data, 'percentage') / data.length;
    const avgGain = sumBy(data, 'gain') / data.length;
    let percentileGain = 0;
    let percentileLength = 0;

    while (
      percentileLength < sortedData.length &&
      percentileGain / totalGain < 0.5 &&
      percentileLength !== 10
    ) {
      percentileGain += sortedData[percentileLength].gain;
      percentileLength += 1;
    }

    const topGain = percentileGain / totalGain * 100;
    let sentence = !indicator ? initialPercent : withIndicatorPercent;
    if (settings.unit !== '%') {
      sentence = !indicator ? initial : withIndicator;
    }

    const valueFormat = topRegion.gain < 1 ? '.3r' : '.3s';
    const aveFormat = avgGain < 1 ? '.3r' : '.3s';

    const params = {
      indicator: indicator && indicator.label.toLowerCase(),
      location: currentLabel,
      topGain: `${format('.2r')(topGain)}%`,
      percentileLength,
      region: percentileLength > 1 ? topRegion.label : 'This region',
      value:
        topRegion.percentage > 0 && settings.unit === '%'
          ? `${format('.2r')(topRegion.percentage)}%`
          : `${format(valueFormat)(topRegion.gain)}ha`,
      average:
        topRegion.percentage > 0 && settings.unit === '%'
          ? `${format('.2r')(avgGainPercentage)}%`
          : `${format(aveFormat)(avgGain)}ha`
    };

    return {
      sentence,
      params
    };
  }
);
