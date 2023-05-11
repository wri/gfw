import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

// get list data
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getIndicator = (state) => state.indicator;
const getWhitelist = (state) => state.polynamesWhitelist;
const getColors = (state) => state.colors;
const getSentence = (state) => state.sentence;
const getTitle = (state) => state.title;
const getLocationName = (state) => state.locationLabel;
const getThreshold = (state) => state.optionsSelected.threshold;
const getDecile = (state) => state.optionsSelected.decile;

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
        percentage: ((cover - plantationsCover) / totalArea) * 100,
      },
      {
        label: 'Other Land Cover',
        value: totalArea - cover - otherCover,
        color: colors.nonForest,
        percentage: ((totalArea - cover - otherCover) / totalArea) * 100,
      },
    ];
    if (indicator) {
      parsedData.splice(1, 0, {
        label: hasPlantations ? 'Other forest cover' : 'Other tree cover',
        value: otherCover,
        color: colors.otherCover,
        percentage: (otherCover / totalArea) * 100,
      });
    } else if (!indicator && hasPlantations) {
      parsedData.splice(1, 0, {
        label: 'Plantations',
        value: plantations,
        color: colors.plantedForest,
        percentage: (plantations / totalArea) * 100,
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
    getThreshold,
    getDecile,
    isoHasPlantations,
  ],
  (
    data,
    settings,
    locationName,
    indicator,
    sentences,
    threshold,
    decile,
    isoPlantations
  ) => {
    if (!data || !sentences) return null;
    const {
      initial,
      initialWithIndicator,
      hasPlantations,
      noPlantations,
      globalInitial,
      globalWithIndicator,
    } = sentences;
    const { cover, plantations, totalCover, totalArea } = data;
    const top = isoPlantations ? cover - plantations : cover;
    const bottom = indicator ? totalCover : totalArea;
    const percentCover = (100 * top) / bottom;
    const thresholdLabel = threshold?.label;
    const decileLabel = decile?.label;
    const params = {
      year: settings.extentYear,
      location: locationName,
      indicator: indicator && indicator.label,
      percentage:
        percentCover >= 0.1 ? `${format('.2r')(percentCover)}%` : '< 0.1%',
      value:
        data.cover < 1
          ? `${format('.3r')(data.cover)}ha`
          : `t${format('.3s')(data.cover)}ha`,
      threshold: thresholdLabel || decileLabel,
      tropical: settings.extentYear === 2020 ? 'tropical ' : ' ',
    };
    let sentence = indicator ? initialWithIndicator : initial;
    sentence = isoPlantations
      ? sentence + hasPlantations
      : sentence + noPlantations;
    if (locationName === 'global') {
      sentence = indicator ? globalWithIndicator : globalInitial;
    }

    return { sentence, params };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle,
});
