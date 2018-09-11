import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

import { getAdminPath } from '../../../utils';

// get list data
const getLoss = state => (state.data && state.data.lossByRegion) || null;
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
const getSentences = state => state.config && state.config.sentences;

export const mapData = createSelector(
  [getLoss, getExtent, getSettings, getLocation, getLocationsMeta, getQuery],
  (data, extent, settings, location, meta, query) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const { startYear, endYear } = settings;
    const mappedData = data.map(d => {
      const region = meta.find(l => d.id === l.value);
      const loss =
        sumBy(
          d.loss.filter(l => l.year >= startYear && l.year <= endYear),
          'area_loss'
        ) || 0;
      const locationExtent = extent.filter(l => l.id === d.id);
      const percentage = loss / locationExtent[0].extent * 100 || 0;
      return {
        label: (region && region.label) || '',
        loss,
        percentage,
        value: settings.unit === 'ha' ? loss : percentage,
        path: getAdminPath({ ...location, query, id: d.id })
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

export const getSentence = createSelector(
  [
    mapData,
    parseData,
    getSettings,
    getOptions,
    getIndicator,
    getCurrentLocation,
    getSentences
  ],
  (data, sortedData, settings, options, indicator, currentLabel, sentences) => {
    if (!data || !options || !currentLabel || !sortedData) return '';
    const {
      initial,
      withIndicator,
      initialPercent,
      withIndicatorPercent,
      noLoss
    } = sentences;
    const { startYear, endYear } = settings;
    const totalLoss = sumBy(data, 'loss');
    const topRegion = (sortedData && sortedData.length && sortedData[0]) || {};
    const avgLossPercentage = sumBy(data, 'percentage') / data.length;
    const avgLoss = sumBy(data, 'loss') / data.length;
    let percentileLoss = 0;
    let percentileLength = 0;

    while (
      percentileLength < data.length &&
      percentileLoss / totalLoss < 0.5 &&
      percentileLength !== 10
    ) {
      percentileLoss += sortedData[percentileLength].loss;
      percentileLength += 1;
    }

    const topLoss = percentileLoss / totalLoss * 100 || 0;
    let sentence = !indicator ? initialPercent : withIndicatorPercent;

    if (settings.unit !== '%') {
      sentence = !indicator ? initial : withIndicator;
    }
    if (percentileLength === 0) {
      sentence = noLoss;
    }

    const valueFormat = topRegion.loss < 1 ? '.3r' : '.3s';
    const aveFormat = avgLoss < 1 ? '.3r' : '.3s';

    const params = {
      indicator: indicator && indicator.label.toLowerCase(),
      location: currentLabel,
      startYear,
      endYear,
      topLoss: `${format('.2r')(topLoss)}%`,
      percentileLength,
      region: percentileLength > 1 ? topRegion.label : 'This region',
      value:
        topRegion.percentage > 0 && settings.unit === '%'
          ? `${format('.2r')(topRegion.percentage)}%`
          : `${format(valueFormat)(topRegion.loss)}ha`,
      average:
        topRegion.percentage > 0 && settings.unit === '%'
          ? `${format('.2r')(avgLossPercentage)}%`
          : `${format(aveFormat)(avgLoss)}ha`
    };

    return {
      sentence,
      params
    };
  }
);
