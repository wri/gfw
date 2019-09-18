import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getLocationName = state => state.locationLabel;
const getColors = state => state.colors;
const getSentences = state => state.sentences;
const getTitle = state => state.title;

// get lists selected
export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (isEmpty(data)) return null;
    const {
      area_ha,
      extent,
      planted_forest,
      forest_primary,
      forest_regenerated
    } = data;
    const otherCover =
      extent - (forest_regenerated + forest_primary + planted_forest);
    const nonForest = area_ha - extent;
    return [
      {
        label: 'Naturally Regenerated Forest',
        value: forest_regenerated,
        percentage: forest_regenerated / area_ha * 100,
        color: colors.naturalForest
      },
      {
        label: 'Primary Forest',
        value: forest_primary || 0,
        percentage: forest_primary / area_ha * 100 || 0,
        color: colors.primaryForest
      },
      {
        label: 'Planted Forest',
        value: planted_forest || 0,
        percentage: planted_forest / area_ha * 100 || 0,
        color: colors.plantedForest
      },
      {
        label: 'Other Tree Cover',
        value: otherCover > 0 ? otherCover : 0,
        percentage: otherCover / area_ha * 100,
        color: colors.otherCover
      },
      {
        label: 'Non-Forest',
        value: nonForest,
        percentage: nonForest / area_ha * 100,
        color: colors.nonForest
      }
    ];
  }
);

export const parseSentence = createSelector(
  [getData, getLocationName, getSentences],
  (data, locationName, sentences) => {
    if (isEmpty(data)) return null;
    const { initial, noPrimary, globalInitial, globalNoPrimary } = sentences;
    const { area_ha, extent, forest_primary } = data;
    const primaryPercent =
      forest_primary > 0
        ? forest_primary / area_ha * 100
        : extent / area_ha * 100;

    const params = {
      location: locationName,
      extent:
        extent < 1
          ? `${format('.3r')(extent)}ha`
          : `${format('.3s')(extent)}ha`,
      primaryPercent:
        primaryPercent >= 0.1 ? `${format('.2r')(primaryPercent)}%` : '< 0.1%'
    };
    let sentence = forest_primary > 0 ? initial : noPrimary;
    if (locationName === 'globally') {
      sentence = forest_primary > 0 ? globalInitial : globalNoPrimary;
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
    if (name === 'globally') {
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
