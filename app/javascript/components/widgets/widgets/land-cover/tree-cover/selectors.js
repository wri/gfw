import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getIndicator = state => state.indicator || null;
const getWhitelist = state => state.whitelists && state.whitelists.adm0;
const getColors = state => state.colors;
const getSentence = state => state.config.sentence;
const getTitle = state => state.config.title;
const getLocationType = state => state.type;
const getLocationName = state => state.locationName;

export const isoHasPlantations = createSelector(
  [getWhitelist, getLocationType],
  (whitelist, type) => {
    const hasPlantations =
      (type !== 'global' && isEmpty(whitelist)) ||
      (whitelist && whitelist.includes('plantations'));
    return hasPlantations;
  }
);

// get lists selected
export const parseData = createSelector(
  [getData, getColors, getIndicator, isoHasPlantations],
  (data, colors, indicator, hasPlantations) => {
    if (isEmpty(data)) return null;
    const { totalArea, totalCover, cover, plantations } = data;
    const otherCover = indicator ? totalCover - cover : 0;
    const plantationsCover = hasPlantations ? plantations : 0;
    const label = indicator ? ` in ${indicator.label}` : '';
    const parsedData = [
      {
        label: hasPlantations
          ? 'Natural Forest'.concat(label)
          : 'Tree Cover'.concat(label),
        value: cover - plantationsCover,
        color: colors.naturalForest,
        percentage: (cover - plantationsCover) / totalArea * 100
      },
      {
        label: 'Non-Forest',
        value: totalArea - cover - otherCover,
        color: colors.nonForest,
        percentage: (totalArea - cover - otherCover) / totalArea * 100
      }
    ];
    if (indicator) {
      parsedData.splice(1, 0, {
        label: hasPlantations ? 'Other forest cover' : 'Other tree cover',
        value: otherCover,
        color: colors.otherCover,
        percentage: otherCover / totalArea * 100
      });
    } else if (!indicator && hasPlantations) {
      parsedData.splice(1, 0, {
        label: 'Plantations',
        value: plantations,
        color: colors.plantedForest,
        percentage: plantations / totalArea * 100
      });
    }
    return parsedData;
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationType, getWhitelist],
  (title, type, whitelist) => {
    let selectedTitle = title.default;
    if (type === 'global') {
      selectedTitle = title.global;
    } else if (
      whitelist &&
      whitelist.length &&
      whitelist.includes('plantations')
    ) {
      selectedTitle = title.withPlantations;
    }
    return selectedTitle;
  }
);

export const parseSentence = createSelector(
  [
    getData,
    getSettings,
    getLocationName,
    getIndicator,
    getSentence,
    isoHasPlantations
  ],
  (data, settings, locationName, indicator, sentences, isoPlantations) => {
    if (!data || !sentences) return null;
    const {
      initial,
      hasPlantations,
      noPlantations,
      hasPlantationsInd,
      noPlantationsInd,
      globalInitial,
      globalWithIndicator
    } = sentences;
    const percentCover = indicator
      ? 100 * data.cover / data.totalCover
      : 100 * data.cover / data.totalArea;
    const params = {
      year: settings.extentYear,
      location: locationName || 'global',
      indicator: indicator && indicator.label.toLowerCase(),
      percentage:
        percentCover >= 0.1 ? `${format('.2r')(percentCover)}%` : '<0.1%',
      value:
        data.cover < 1
          ? `${format('.3r')(data.cover)}ha`
          : `${format('.3s')(data.cover)}ha`
    };
    let sentence = isoPlantations
      ? initial + hasPlantations
      : initial + noPlantations;
    if (indicator) {
      sentence = isoPlantations
        ? initial + hasPlantationsInd
        : initial + noPlantationsInd;
    }
    if (locationName === 'global') {
      sentence = indicator ? globalWithIndicator : globalInitial;
    }
    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
