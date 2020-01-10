import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getIndicator = state => state.indicator;
const getLandCategory = state => state.landCategory;
const getForestType = state => state.forestType;
const getLocationsMeta = state => state.childData;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;
const getTitle = state => state.title;

export const parseList = createSelector(
  [getData, getSettings, getLocationsMeta, getColors],
  (data, settings, meta, colors) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach(d => {
      const regionMeta = meta[d.id];
      if (regionMeta) {
        dataMapped.push({
          label: (regionMeta && regionMeta.label) || '',
          extent: d.extent,
          percentage: d.percentage,
          value: settings.unit === 'ha' ? d.extent : d.percentage,
          path: regionMeta.path,
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

export const parseSentence = createSelector(
  [
    parseList,
    parseData,
    getSettings,
    getIndicator,
    getForestType,
    getLandCategory,
    getLocationName,
    getSentences
  ],
  (
    sortedList,
    data,
    settings,
    indicator,
    forestType,
    landCategory,
    locationName,
    sentences
  ) => {
    if (!data || !locationName) return null;
    const {
      initial,
      hasIndicator,
      landCatOnly,
      globalInitial,
      globalWithIndicator,
      globalLandCatOnly,
      percInitial,
      percHasIndicator,
      percLandCatOnly,
      percGlobalInitial,
      percGlobalWithIndicator,
      percGlobalLandCatOnly,
      noCover
    } = sentences;
    const topRegion = (data.length && data[0]) || {};
    const totalExtent = sumBy(data, 'extent') || 0;
    const avgExtent = sumBy(data, 'extent') || 0 / data.length;
    const avgExtentPercentage = (sumBy(data, 'percentage') || 0) / data.length;
    let percentileExtent = 0;
    let percentileLength = 0;
    while (
      percentileLength < sortedList.length &&
      percentileExtent / totalExtent < 0.5 &&
      percentileLength !== 10
    ) {
      percentileExtent += sortedList[percentileLength].extent;
      percentileLength += 1;
    }
    const topExtent = percentileExtent / (totalExtent || 0) * 100;

    const topRegionExtent =
      topRegion.extent < 1
        ? `${format('.3r')(topRegion.extent)}ha`
        : `${format('.3s')(topRegion.extent)}ha`;
    const aveRegionExtent =
      avgExtent < 1
        ? `${format('.3r')(avgExtent)}ha`
        : `${format('.3s')(avgExtent)}ha`;

    const topRegionPercent =
      topRegion.percentage < 0.1
        ? '< 0.1%'
        : `${format('.2r')(topRegion.percentage)}%`;
    const aveRegionPercent =
      avgExtentPercentage < 0.1
        ? '< 0.1%'
        : `${format('.2r')(avgExtentPercentage)}%`;

    const params = {
      location: locationName === 'global' ? 'Globally' : locationName,
      region: topRegion.label,
      indicator: indicator && indicator.label,
      percentage: topExtent ? `${format('.2r')(topExtent)}%` : '0%',
      year: settings.extentYear,
      value: settings.unit === '%' ? topRegionPercent : topRegionExtent,
      average: settings.unit === '%' ? aveRegionPercent : aveRegionExtent,
      count: percentileLength
    };

    let sentence = noCover;
    if (params.percentage !== '0%' && settings.unit === '%') {
      sentence = locationName === 'global' ? percGlobalInitial : percInitial;
      if (landCategory && !forestType) {
        sentence =
          locationName === 'global' ? percGlobalLandCatOnly : percLandCatOnly;
      } else if (indicator) {
        sentence =
          locationName === 'global'
            ? percGlobalWithIndicator
            : percHasIndicator;
      }
    } else if (params.percentage !== '0%' && settings.unit === 'ha') {
      sentence = locationName === 'global' ? globalInitial : initial;
      if (landCategory && !forestType) {
        sentence = locationName === 'global' ? globalLandCatOnly : landCatOnly;
      } else if (indicator) {
        sentence =
          locationName === 'global' ? globalWithIndicator : hasIndicator;
      }
    }
    return {
      sentence,
      params
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.initial;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
