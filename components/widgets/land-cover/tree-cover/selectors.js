import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';

// get list data
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getIndicator = (state) => state.indicator;
const getColors = (state) => state.colors;
const getSentence = (state) => state.sentence;
const getTitle = (state) => state.title;
const getLocationName = (state) => state.locationLabel;
const getMetaKey = (state) => state.metaKey;
const getAdminLevel = (state) => state.adminLevel;

export const parseData = createSelector(
  [getData, getColors, getIndicator, getSettings],
  (data, colors, indicator, settings) => {
    if (isEmpty(data)) return null;

    const { landCategory } = settings;
    const { totalArea, totalExtent, treeCover } = data;

    const hasIntersection = !!landCategory;
    const otherCover = indicator ? totalExtent - treeCover : 0;
    const label = indicator ? ` in ${indicator.label}` : '';
    const indicators = indicator?.value?.split('__') || [];
    const hasPlantations = indicators.includes('plantations');
    const parsedData = [
      {
        label: 'Tree Cover'.concat(label),
        value: treeCover,
        color: colors.naturalForest,
        percentage: (treeCover / totalArea) * 100,
      },
      {
        label: 'Other Land Cover',
        value:
          hasIntersection && !hasPlantations // solution for multiple intersections. E.g. Landmark and Plantations
            ? otherCover
            : totalArea - treeCover - otherCover,
        color: colors.nonForest,
        percentage: ((totalArea - treeCover - otherCover) / totalArea) * 100,
      },
    ];

    if (hasPlantations) {
      parsedData.splice(1, 0, {
        label: 'Other tree cover',
        value: totalExtent - treeCover,
        color: colors.otherCover,
        percentage: ((totalExtent - treeCover) / totalArea) * 100,
      });
    }

    return parsedData;
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    return name === 'global' ? title.global : title.default;
  }
);

export const parseSentence = createSelector(
  [
    getData,
    getSettings,
    getLocationName,
    getIndicator,
    getSentence,
    getAdminLevel,
  ],
  (data, settings, locationName, indicator, sentences, admLevel) => {
    if (!data || !sentences) return null;

    const { extentYear, threshold, decile, landCategory, forestType } =
      settings;

    const hasIntersection = !!landCategory || !!forestType;
    const isTropicalTreeCover = extentYear === 2020;
    const withIndicator = !!indicator;
    const decileThreshold = isTropicalTreeCover ? decile : threshold;

    const sentenceKey = withIndicator ? 'withIndicator' : 'default';
    const sentenceSubkey = admLevel === 'global' ? 'global' : 'region';
    const sentenceTreeCoverType = isTropicalTreeCover
      ? 'tropicalTreeCover'
      : 'treeCover';
    const sentence =
      sentences[sentenceKey][sentenceSubkey][sentenceTreeCoverType];

    const { treeCover, totalArea, totalExtent } = data;
    const top = treeCover;
    const bottom = hasIntersection ? totalExtent : totalArea;
    const percentCover = (100 * top) / bottom;

    const formattedPercentage = formatNumber({ num: percentCover, unit: '%' });

    const thresholdLabel = `>${decileThreshold}%`;

    const params = {
      year: extentYear,
      location: locationName,
      percentage: formattedPercentage,
      indicator: indicator?.label,
      threshold: thresholdLabel,
    };

    return { sentence, params };
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
