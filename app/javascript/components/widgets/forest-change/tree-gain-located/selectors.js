import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getGain = state => (state.data && state.data.gain) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocation = state => state.allLocation || null;
const getLocationsMeta = state => state.childLocationData || null;
const getLocationName = state => state.locationName || null;
const getColors = state => state.colors || null;
const getSentences = state => state.sentences || null;

export const getSortedData = createSelector(
  [getGain, getExtent, getSettings, getLocation, getLocationsMeta, getColors],
  (data, extent, settings, location, meta, colors) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach(d => {
      const region = meta.find(l => parseInt(d.id, 10) === l.value);
      if (region) {
        const locationExtent = extent.find(l => l.id === parseInt(d.id, 10));
        const percentage = locationExtent
          ? d.gain / locationExtent.extent * 100
          : 0;
        const { payload, query, type } = location;

        dataMapped.push({
          label: (region && region.label) || '',
          gain: d.gain,
          percentage,
          value: settings.unit === 'ha' ? d.gain : percentage,
          path: {
            type,
            payload: {
              ...payload,
              ...(payload.adm1 && {
                adm2: d.id
              }),
              ...(!payload.adm1 && {
                adm1: d.id
              })
            },
            query: {
              ...query,
              map: {
                ...(query && query.map),
                canBound: true
              }
            }
          },
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

export const parseSentence = createSelector(
  [
    getSortedData,
    parseData,
    getSettings,
    getOptions,
    getIndicator,
    getLocationName,
    getSentences
  ],
  (data, sortedData, settings, options, indicator, locationName, sentences) => {
    if (!data || !options || !locationName) return null;
    const {
      initial,
      withIndicator,
      initialPercent,
      withIndicatorPercent
    } = sentences;
    const totalGain = sumBy(data, 'gain') || 0;
    const topRegion = (sortedData && sortedData.length && sortedData[0]) || {};
    const avgGainPercentage = sumBy(data, 'percentage') || 0 / data.length;
    const avgGain = sumBy(data, 'gain') || 0 / data.length;
    let percentileGain = 0;
    let percentileLength = 0;

    while (
      sortedData &&
      percentileLength < sortedData.length &&
      percentileGain / totalGain < 0.5 &&
      percentileLength !== 10
    ) {
      percentileGain += sortedData[percentileLength].gain;
      percentileLength += 1;
    }

    const topGain = percentileGain / totalGain * 100 || 0;
    let sentence = !indicator ? initialPercent : withIndicatorPercent;
    if (settings.unit !== '%') {
      sentence = !indicator ? initial : withIndicator;
    }

    const valueFormat = topRegion.gain < 1 ? '.3r' : '.3s';
    const aveFormat = avgGain < 1 ? '.3r' : '.3s';

    const params = {
      indicator: indicator && indicator.label.toLowerCase(),
      location: locationName,
      topGain: `${format('.2r')(topGain)}%`,
      percentileLength: percentileLength || '0',
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

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
