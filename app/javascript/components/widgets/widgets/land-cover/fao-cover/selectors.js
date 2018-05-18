import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getCurrentLocation = state => state.currentLabel || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

// get lists selected
export const parseData = createSelector(
  [getData, getCurrentLocation, getColors],
  (data, currentLabel, colors) => {
    if (isEmpty(data) || !currentLabel) return null;
    const {
      area_ha,
      extent,
      planted_forest,
      forest_primary,
      forest_regenerated
    } = data;
    const colorRange = colors.ramp;
    const naturallyRegenerated = extent / 100 * forest_regenerated || 0;
    const primaryForest = extent / 100 * forest_primary || 0;
    const plantedForest = extent / 100 * planted_forest || 0;
    const otherCover =
      extent - (naturallyRegenerated + primaryForest + plantedForest);
    const nonForest = area_ha - extent;

    return [
      {
        label: 'Naturally Regenerated Forest',
        value: naturallyRegenerated,
        percentage: naturallyRegenerated / area_ha * 100,
        color: colorRange[1]
      },
      {
        label: 'Primary Forest',
        value: primaryForest,
        percentage: primaryForest / area_ha * 100,
        color: colorRange[2]
      },
      {
        label: 'Planted Forest',
        value: plantedForest,
        percentage: plantedForest / area_ha * 100,
        color: colorRange[4]
      },
      {
        label: 'Other Tree Cover',
        value: otherCover,
        percentage: otherCover / area_ha * 100,
        color: colorRange[6]
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

export const getSentence = createSelector(
  [getData, getCurrentLocation, getSentences],
  (data, currentLabel, sentences) => {
    if (isEmpty(data) || !currentLabel) return null;
    const { initial, noPrimary } = sentences;
    const { area_ha, extent, forest_primary } = data;
    const primaryForest = extent / 100 * forest_primary;
    const sentence = primaryForest > 0 ? initial : noPrimary;
    const params = {
      location: currentLabel,
      extent: `${format('.3s')(extent)}ha`,
      primaryPercent:
        primaryForest > 0
          ? `${format('.0f')(primaryForest / area_ha * 100)}%`
          : `${format('.0f')(extent / area_ha * 100)}%`
    };
    return {
      sentence,
      params
    };
  }
);
