import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

// get lists selected
export const getFAOCoverData = createSelector(
  [getData, getLocationNames, getColors],
  (data, locationNames, colors) => {
    if (isEmpty(data) || !locationNames) return null;
    const {
      area_ha,
      extent,
      forest_planted,
      forest_primary,
      forest_regenerated
    } = data;

    const naturallyRegenerated = extent / 100 * forest_regenerated;
    const primaryForest = extent / 100 * forest_primary;
    const plantedForest = extent / 100 * forest_planted;
    const nonForest =
      area_ha - (naturallyRegenerated + primaryForest + plantedForest);
    const total =
      naturallyRegenerated + primaryForest + plantedForest + area_ha;
    return [
      {
        label: 'Naturally regenerated Forest',
        value: naturallyRegenerated,
        percentage: naturallyRegenerated / total * 100,
        color: colors.darkGreen
      },
      {
        label: 'Primary Forest',
        value: primaryForest,
        percentage: primaryForest / total * 100,
        color: colors.mediumGreen
      },
      {
        label: 'Planted Forest',
        value: plantedForest,
        percentage: plantedForest / total * 100,
        color: colors.lightGreen
      },
      {
        label: 'Non-Forest',
        value: nonForest,
        percentage: nonForest / total * 100,
        color: colors.nonForest
      }
    ];
  }
);

export const getSentence = createSelector(
  [getData, getLocationNames],
  (data, locationNames) => {
    if (isEmpty(data) || !locationNames) return null;
    const {
      area_ha,
      extent,
      forest_planted,
      forest_primary,
      forest_regenerated,
      rank
    } = data;
    const naturallyRegenerated = extent / 100 * forest_regenerated;
    const primaryForest = extent / 100 * forest_primary;
    const plantedForest = extent / 100 * forest_planted;
    const nonForest =
      area_ha - (naturallyRegenerated + primaryForest + plantedForest);

    const sentence = `FAO data from 2015 shows that ${locationNames.current &&
      locationNames.current.label} is ${
      nonForest / area_ha > 0.5 ? 'mostly non-forest.' : 'mostly forest.'
    }${
      primaryForest > 0
        ? ` Primary forest occupies <strong>${format('.1f')(
          primaryForest / area_ha * 100
        )}%</strong> of the country. This gives ${locationNames.current &&
            locationNames.current
              .label} a rank of <strong>${rank}th</strong> out of 110 countries in terms of its relative amount of primary forest.`
        : ''
    }`;
    return sentence;
  }
);
