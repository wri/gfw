import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';

const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getIndicator = (state) => state.indicator;
const getWhitelist = (state) => state.polynamesWhitelist;
const getSentence = (state) => state.sentence;
const getTitle = (state) => state.title;
const getLocationName = (state) => state.locationLabel;
const getMetaKey = (state) => state.metaKey;
const getAdminLevel = (state) => state.adminLevel;

export const isoHasPlantations = createSelector(
  [getWhitelist, getLocationName],
  (whitelist, name) => {
    const hasPlantations =
      name === 'global'
        ? true
        : whitelist &&
          whitelist.annual &&
          whitelist.annual.includes('plantations');
    return hasPlantations;
  }
);

export const parseData = createSelector([getData], (data) => {
  if (isEmpty(data)) {
    return null;
  }

  const { totalNaturalForest, unknown, totalNonNaturalTreeCover, totalArea } =
    data;
  const parsedData = [
    {
      label: 'Natural forests',
      value: totalNaturalForest,
      color: '#2C6639',
      percentage: (totalNaturalForest / totalArea) * 100,
    },
    {
      label: 'Non-natural tree cover',
      value: totalNonNaturalTreeCover,
      color: '#A8DDB5',
      percentage: (totalNonNaturalTreeCover / totalArea) * 100,
    },
    {
      label: 'Other land cover',
      value: unknown,
      color: '#D3D3D3',
      percentage: (unknown / totalArea) * 100,
    },
  ];

  return parsedData;
});

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

    const { extentYear, threshold, decile } = settings;

    const isTropicalTreeCover = extentYear === 2020;
    const decileThreshold = isTropicalTreeCover ? decile : threshold;
    const withIndicator = !!indicator;
    const sentenceKey = withIndicator ? 'withIndicator' : 'default';
    const sentenceSubkey = admLevel === 'global' ? 'global' : 'region';
    const sentence = sentences[sentenceKey][sentenceSubkey];

    const { totalNaturalForest, totalNonNaturalTreeCover, totalArea } = data;
    const percentNaturalForest = (100 * totalNaturalForest) / totalArea;
    const percentNonNaturalForest =
      (100 * totalNonNaturalTreeCover) / totalArea;

    const formattedNaturalForestPercentage = formatNumber({
      num: percentNaturalForest,
      unit: '%',
    });
    const formattedNonNaturalForestPercentage = formatNumber({
      num: percentNonNaturalForest,
      unit: '%',
    });

    const thresholdLabel = `>${decileThreshold}%`;

    const params = {
      year: extentYear,
      location: locationName,
      naturalForestPercentage: formattedNaturalForestPercentage,
      nonNaturalForestPercentage: formattedNonNaturalForestPercentage,
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
