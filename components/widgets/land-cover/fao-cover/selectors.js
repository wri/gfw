import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'utils/format';

// get list data
const getData = (state) => state.data;
const getLocationName = (state) => state.locationLabel;
const getColors = (state) => state.colors;
const getSentences = (state) => state.sentences;
const getTitle = (state) => state.title;
const getSettings = (state) => state.settings;

// get lists selected
export const parseData = createSelector(
  [getData, getColors],
  (data, colors) => {
    if (isEmpty(data)) {
      return null;
    }

    const { area_ha, extent, planted_forest, forest_primary } = data;
    const otherCover = extent - (forest_primary + planted_forest);
    const nonForest = area_ha - extent;

    const chartItems = [
      {
        label: 'Primary Forest',
        value: forest_primary || 0,
        percentage: (forest_primary / area_ha) * 100 || 0,
        color: colors.primaryForest,
      },
      {
        label: 'Planted Forest',
        value: planted_forest || 0,
        percentage: (planted_forest / area_ha) * 100 || 0,
        color: colors.plantedForest,
      },
      {
        label: 'Other Tree Cover',
        value: otherCover > 0 ? otherCover : 0,
        percentage: (otherCover / area_ha) * 100,
        color: colors.otherCover,
      },
      {
        label: 'Non-Forest',
        value: nonForest,
        percentage: (nonForest / area_ha) * 100,
        color: colors.nonForest,
      },
    ];

    if (forest_primary === null) {
      return chartItems.slice(1, chartItems.length);
    }

    return chartItems;
  }
);

export const parseSentence = createSelector(
  [getData, getLocationName, getSentences, getSettings],
  (data, locationName, sentences, settings) => {
    if (isEmpty(data)) return null;

    const { initial, noPrimary, globalInitial } = sentences;
    const { area_ha, extent, forest_primary } = data;
    const { faoYear } = settings;

    const primaryPercent = (forest_primary * 100) / area_ha;
    const percent = (extent / area_ha) * 100;
    const params = {
      location: locationName === 'global' ? 'globally' : locationName,
      extent: formatNumber({ num: extent, unit: 'ha', spaceUnit: true }),
      primaryPercent: formatNumber({ num: primaryPercent, unit: '%' }),
      year: faoYear,
      percent: formatNumber({ num: percent, unit: '%' }),
      amountInHectares: formatNumber({
        num: extent,
        unit: 'ha',
        spaceUnit: true,
      }),
      country: locationName,
    };

    let sentence =
      forest_primary !== null && forest_primary > 0 ? initial : noPrimary;

    if (locationName === 'global') {
      sentence = globalInitial;
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

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle,
});
