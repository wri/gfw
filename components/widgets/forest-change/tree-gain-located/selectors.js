import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import { formatNumber } from 'utils/format';

// get list data
const getGain = (state) => state.data && state.data.gain;
const getExtent = (state) => state.data && state.data.extent;
const getSettings = (state) => state.settings;
const getIndicator = (state) => state.indicator;
const getLocationsMeta = (state) => state.childData;
const getLocationName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSentences = (state) => state.sentences;

export const getSortedData = createSelector(
  [getGain, getExtent, getSettings, getLocationsMeta, getColors],
  (data, extent, settings, meta, colors) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach((d) => {
      const region = meta[d.id];
      if (region) {
        const locationExtent = extent.find((l) => l.id === parseInt(d.id, 10));
        const percentage = locationExtent
          ? (d.gain / locationExtent.extent) * 100
          : 0;

        dataMapped.push({
          label: (region && region.label) || '',
          gain: d.gain,
          percentage,
          value: settings.unit === 'ha' ? d.gain : percentage,
          color: colors.main,
        });
      }
    });
    return sortBy(dataMapped, 'gain');
  }
);

export const parseData = createSelector([getSortedData], (data) => {
  if (!data || !data.length) return null;
  return sortBy(uniqBy(data, 'label'), 'value').reverse();
});

export const parseSentence = createSelector(
  [
    getSortedData,
    parseData,
    getSettings,
    getIndicator,
    getLocationName,
    getSentences,
  ],
  (data, sortedData, settings, indicator, locationName, sentences) => {
    if (!data || !locationName) return null;

    const { initial, withIndicator, initialPercent, withIndicatorPercent } =
      sentences;
    const totalGain = sumBy(data, 'gain') || 0;
    const topRegion = (sortedData && sortedData.length && sortedData[0]) || {};
    const avgGainPercentage = sumBy(data, 'percentage') || 0 / data.length;
    const avgGain = (sumBy(data, 'gain') || 0) / data.length;
    const { baselineYear: dateFromDashboard, startYear: dateFromMapLayer } =
      settings;

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

    const topGain = (percentileGain / totalGain) * 100 || 0;
    let sentence = !indicator ? initialPercent : withIndicatorPercent;
    if (settings.unit !== '%') {
      sentence = !indicator ? initial : withIndicator;
    }

    const valueFormat = topRegion.gain < 1 ? '.3r' : '.3s';
    const aveFormat = avgGain < 1 ? '.3r' : '.3s';

    const params = {
      baselineYear: dateFromMapLayer || dateFromDashboard || 2000,
      indicator: indicator && indicator.label,
      location: locationName,
      topGain: formatNumber({
        num: topGain,
        unit: '%',
      }),
      percentileLength: percentileLength || '0',
      region: percentileLength > 1 ? topRegion.label : 'This region',
      value:
        topRegion.percentage > 0 && settings.unit === '%'
          ? formatNumber({
              num: topRegion.percentage,
              unit: '%',
            })
          : formatNumber({
              num: topRegion.gain,
              unit: 'ha',
              spaceUnit: true,
              specialSpecifier: valueFormat,
            }),
      average:
        topRegion.percentage > 0 && settings.unit === '%'
          ? formatNumber({
              num: avgGainPercentage,
              unit: '%',
            })
          : formatNumber({
              num: avgGain,
              unit: 'ha',
              spaceUnit: true,
              specialSpecifier: aveFormat,
            }),
    };

    return {
      sentence,
      params,
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
});
