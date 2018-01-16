import { createSelector } from 'reselect';
import COLORS from 'pages/country/data/colors.json';

// get list data
const getFAO = state => state.fao || null;
const getRank = state => state.rank || null;
const getLocationNames = state => state.locationNames || null;

// get lists selected
export const getFAOCoverData = createSelector(
  [getFAO, getRank, getLocationNames],
  (fao, rank, locationNames) => {
    if (!fao || !rank || !locationNames) {
      return [];
    }

    const {
      area_ha,
      extent,
      forest_planted,
      forest_primary,
      forest_regenerated
    } = fao;

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
        color: COLORS.darkGreen
      },
      {
        label: 'Primary Forest',
        value: primaryForest,
        percentage: primaryForest / total * 100,
        color: COLORS.mediumGreen
      },
      {
        label: 'Planted Forest',
        value: plantedForest,
        percentage: plantedForest / total * 100,
        color: COLORS.lightGreen
      },
      {
        label: 'Non-Forest',
        value: nonForest,
        percentage: nonForest / total * 100,
        color: COLORS.nonForest
      }
    ];
  }
);
