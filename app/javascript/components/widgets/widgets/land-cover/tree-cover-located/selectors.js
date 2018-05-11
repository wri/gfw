import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocation = state => state.payload || null;
const getLocationsMeta = state => state[state.adminKey] || null;
const getCurrentLocation = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

export const parseData = createSelector(
  [getData, getSettings, getLocation, getLocationsMeta, getColors],
  (data, settings, location, meta, colors) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach(d => {
      const region = meta.find(l => d.id === l.value);
      if (region) {
        dataMapped.push({
          label: (region && region.label) || '',
          extent: d.extent,
          percentage: d.percentage,
          value: settings.unit === 'ha' ? d.extent : d.percentage,
          path: `/dashboards/country/${location.country}/${
            location.region ? `${location.region}/` : ''
          }${d.id}`,
          color: colors.main
        });
      }
    });
    return sortByKey(uniqBy(dataMapped, 'label'), 'value', true);
  }
);

export const getSentence = createSelector(
  [
    parseData,
    getSettings,
    getOptions,
    getLocation,
    getIndicator,
    getCurrentLocation,
    getSentences
  ],
  (data, settings, options, location, indicator, currentLabel, sentences) => {
    if (!data || !options || !currentLabel) return null;
    const {
      hasPercentage,
      initial,
      hasIndicator,
      globalInitial,
      globalHasPercentage,
      globalWithIndicator
    } = sentences;
    const topRegion = data.length && data[0];
    const totalExtent = sumBy(data, 'extent');
    const avgExtent = sumBy(data, 'extent') / data.length;
    const avgExtentPercentage = sumBy(data, 'percentage') / data.length;
    let percentileExtent = 0;
    let percentileLength = 0;
    while (
      (percentileLength < data.length &&
        percentileExtent / totalExtent < 0.5) ||
      (percentileLength < 10 && data.length > 10)
    ) {
      percentileExtent += data[percentileLength].extent;
      percentileLength += 1;
    }
    const topExtent = percentileExtent / (totalExtent || 0) * 100;

    const params = {
      location: currentLabel === 'global' ? 'Globally' : currentLabel,
      region: topRegion.label,
      indicator: indicator && indicator.label,
      percentage: topExtent ? `${format('.0f')(topExtent)}%` : '0%',
      value:
        settings.unit === '%'
          ? `${format('.0f')(topRegion.percentage)}%`
          : `${format('.3s')(topRegion.extent)}ha`,
      average:
        settings.unit === '%'
          ? `${format('.0f')(avgExtentPercentage)}%`
          : `${format('.3s')(avgExtent)}ha`,
      count: percentileLength,
      metric: settings.unit === '%' ? 'relative tree cover' : 'tree cover'
    };

    let sentence = currentLabel === 'global' ? globalInitial : initial;
    if (settings.unit === '%') {
      sentence =
        currentLabel === 'global' ? globalHasPercentage : hasPercentage;
    } else if (indicator) {
      sentence = currentLabel === 'global' ? globalWithIndicator : hasIndicator;
    }

    return {
      sentence,
      params
    };
  }
);
