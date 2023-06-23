import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import { formatNumber } from 'utils/format';

// get list data
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getIndicator = (state) => state.indicator;
const getLocationsMeta = (state) => state.childData;
const getLocationName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSentences = (state) => state.sentences;
const getTitle = (state) => state.title;
const getMetaKey = (state) => state.metaKey;

export const parseList = createSelector(
  [getData, getSettings, getLocationsMeta, getColors],
  (data, settings, meta, colors) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach((d) => {
      const regionMeta = meta[d.id];
      if (regionMeta) {
        dataMapped.push({
          label: (regionMeta && regionMeta.label) || '',
          extent: d.extent,
          percentage: d.percentage,
          value: settings.unit === 'ha' ? d.extent : d.percentage,
          path: regionMeta.path,
          color: colors.main,
        });
      }
    });
    return sortBy(dataMapped, 'extent').reverse();
  }
);

export const parseData = createSelector([parseList], (data) => {
  if (isEmpty(data)) return null;
  return sortBy(uniqBy(data, 'label'), 'value').reverse();
});

export const parseSentence = createSelector(
  [
    parseList,
    parseData,
    getSettings,
    getIndicator,
    getLocationName,
    getSentences,
  ],
  (sortedList, data, settings, indicator, locationName, sentences) => {
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
      noCover,
    } = sentences;
    const { unit, extentYear } = settings;
    const { forestType, landCategory } = settings;

    const topRegion = (data.length && data[0]) || {};
    const totalExtent = sumBy(data, 'extent') || 0;
    const avgExtent = sumBy(data, 'extent') / data.length || 0;
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
    const topExtent =
      (totalExtent > 0 && (percentileExtent / totalExtent) * 100) || 0;

    const topRegionExtent = formatNumber({ num: topRegion.extent, unit: 'ha' });
    const aveRegionExtent = formatNumber({ num: avgExtent, unit: 'ha' });
    const topRegionPercent = formatNumber({
      num: topRegion.percentage,
      unit: '%',
    });
    const aveRegionPercent = formatNumber({
      num: avgExtentPercentage,
      unit: '%',
    });
    const topExtentPercent = formatNumber({
      num: topExtent,
      unit: '%',
    });

    const params = {
      location: locationName === 'global' ? 'Globally' : locationName,
      region: topRegion.label,
      indicator: indicator && indicator.label,
      percentage: topExtentPercent,
      year: extentYear,
      value: unit === '%' ? topRegionPercent : topRegionExtent,
      average: unit === '%' ? aveRegionPercent : aveRegionExtent,
      count: percentileLength,
    };

    let sentence = noCover;

    if (topExtent !== 0 && unit === '%') {
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
    } else if (topExtent !== 0 && settings.unit === 'ha') {
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
      params,
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

export const parseMetaKey = createSelector(
  [getMetaKey, getSettings],
  (metaKey, settings) => metaKey[settings.extentYear]
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle,
  metaKey: parseMetaKey,
});
