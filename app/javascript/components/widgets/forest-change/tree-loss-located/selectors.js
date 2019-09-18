import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { formatNumber } from 'utils/format';
import { format } from 'd3-format';

// get list data
const getLoss = state => (state.data && state.data.lossByRegion) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocationsMeta = state => state.childLocationData || null;
const getLocationName = state => state.locationLabel || null;
const getColors = state => state.colors || null;
const getSentences = state => state.sentences;

export const mapData = createSelector(
  [getLoss, getExtent, getSettings, getLocationsMeta],
  (data, extent, settings, meta) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const { startYear, endYear } = settings;
    const mappedData = data.map(d => {
      const region = meta.find(l => d.id === l.value);
      const loss =
        sumBy(
          d.loss.filter(l => l.year >= startYear && l.year <= endYear),
          'area'
        ) || 0;
      const locationExtentById = extent.filter(l => l.id === d.id);
      const locationExtent =
        locationExtentById &&
        !!locationExtentById.length &&
        locationExtentById[0].extent;
      const percentage =
        loss && locationExtent ? loss / locationExtent * 100 : 0;
      const normalPercentage = percentage > 100 ? 100 : percentage;

      return {
        label: (region && region.label) || '',
        loss,
        percentage: normalPercentage,
        value: settings.unit === 'ha' ? loss : normalPercentage
      };
    });

    return sortByKey(mappedData, 'loss');
  }
);

export const parseData = createSelector(
  [mapData, getColors],
  (data, colors) => {
    if (!data) return null;
    const sortedData = sortByKey(uniqBy(data, 'label'), 'value', true);

    return sortedData.map(o => ({
      ...o,
      color: colors.main
    }));
  }
);

export const parseSentence = createSelector(
  [
    mapData,
    parseData,
    getSettings,
    getOptions,
    getIndicator,
    getLocationName,
    getSentences
  ],
  (data, sortedData, settings, options, indicator, locationName, sentences) => {
    if (!data || !options || !locationName || !sortedData) return '';
    const {
      initial,
      withIndicator,
      initialPercent,
      withIndicatorPercent,
      noLoss
    } = sentences;
    const { startYear, endYear } = settings;
    const totalLoss = sumBy(data, 'loss') || 0;
    const topRegion = (sortedData && sortedData.length && sortedData[0]) || {};
    const avgLossPercentage = sumBy(data, 'percentage') || 0 / data.length;
    const avgLoss = sumBy(data, 'loss') || 0 / data.length;
    let percentileLoss = 0;
    let percentileLength = 0;

    while (
      data &&
      sortedData &&
      percentileLength < data.length &&
      percentileLoss / totalLoss < 0.5 &&
      percentileLength !== 10
    ) {
      const percentile = sortedData[percentileLength];
      if (percentile) {
        percentileLoss += percentile.loss;
        percentileLength += 1;
      }
    }

    const topLoss = percentileLoss / totalLoss * 100 || 0;
    let sentence = !indicator ? initialPercent : withIndicatorPercent;

    if (settings.unit !== '%') {
      sentence = !indicator ? initial : withIndicator;
    }
    if (percentileLength === 0) {
      sentence = noLoss;
    }

    const params = {
      indicator: indicator && indicator.label.toLowerCase(),
      location: locationName,
      startYear,
      endYear,
      topLoss: `${format('.2r')(topLoss)}%`,
      percentileLength,
      region: percentileLength > 1 ? topRegion.label : 'This region',
      value:
        topRegion.percentage > 0 && settings.unit === '%'
          ? formatNumber({ num: topRegion.percentage, unit: '%' })
          : formatNumber({ num: topRegion.loss, unit: 'ha' }),
      average:
        topRegion.percentage > 0 && settings.unit === '%'
          ? formatNumber({ num: avgLossPercentage, unit: '%' })
          : formatNumber({ num: avgLoss, unit: 'ha' })
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
