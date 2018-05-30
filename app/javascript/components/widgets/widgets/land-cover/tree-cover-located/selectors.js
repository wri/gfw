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
const getLocationsMeta = state => state[state.childKey] || null;
const getCurrentLocation = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

export const parseList = createSelector(
  [getData, getSettings, getLocation, getLocationsMeta, getColors],
  (data, settings, location, meta, colors) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const dataMapped = [];
    const { type, country, region } = location;
    data.forEach(d => {
      const regionMeta = meta.find(l => d.id === l.value);
      if (regionMeta) {
        dataMapped.push({
          label: (regionMeta && regionMeta.label) || '',
          extent: d.extent,
          percentage: d.percentage,
          value: settings.unit === 'ha' ? d.extent : d.percentage,
          path: `/dashboards/${type || 'global'}/${country}/${
            region ? `${region}/` : ''
          }${d.id}`,
          color: colors.main
        });
      }
    });
    return sortByKey(dataMapped, 'extent', true);
  }
);

export const parseData = createSelector([parseList], data => {
  if (isEmpty(data)) return null;
  return sortByKey(uniqBy(data, 'label'), 'value', true);
});

export const getSentence = createSelector(
  [
    parseList,
    parseData,
    getSettings,
    getOptions,
    getLocation,
    getIndicator,
    getCurrentLocation,
    getSentences
  ],
  (
    list,
    data,
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
      hasIndicator,
      globalInitial,
      globalWithIndicator,
      percInitial,
      percHasIndicator,
      percGlobalInitial,
      percGlobalWithIndicator,
      noCover
    } = sentences;
    const topRegion = data.length && data[0];
    const totalExtent = sumBy(data, 'extent');
    const avgExtent = sumBy(data, 'extent') / data.length;
    const avgExtentPercentage = sumBy(data, 'percentage') / data.length;
    let percentileExtent = 0;
    let percentileLength = 0;
    while (
      percentileLength < data.length &&
      percentileExtent / totalExtent < 0.5 &&
      data.length !== 10
    ) {
      percentileExtent += list[percentileLength].extent;
      percentileLength += 1;
    }
    const topExtent = percentileExtent / (totalExtent || 0) * 100;

    const params = {
      location: currentLabel === 'global' ? 'Globally' : currentLabel,
      region: topRegion.label,
      indicator: indicator && indicator.label.toLowerCase(),
      percentage: topExtent ? `${format('.2r')(topExtent)}%` : '0%',
      year: settings.extentYear,
      value:
        settings.unit === '%'
          ? `${format('.2r')(topRegion.percentage)}%`
          : `${format('.3s')(topRegion.extent)}ha`,
      average:
        settings.unit === '%'
          ? `${format('.2r')(avgExtentPercentage)}%`
          : `${format('.3s')(avgExtent)}ha`,
      count: percentileLength
    };

    let sentence = noCover;
    if (params.percentage !== '0%' && settings.unit === '%') {
      sentence = currentLabel === 'global' ? percGlobalInitial : percInitial;
      if (indicator) {
        sentence =
          currentLabel === 'global'
            ? percGlobalWithIndicator
            : percHasIndicator;
      }
    } else if (params.percentage !== '0%' && settings.unit === 'ha') {
      sentence = currentLabel === 'global' ? globalInitial : initial;
      if (indicator) {
        sentence =
          currentLabel === 'global' ? globalWithIndicator : hasIndicator;
      }
    }

    return {
      sentence,
      params
    };
  }
);
