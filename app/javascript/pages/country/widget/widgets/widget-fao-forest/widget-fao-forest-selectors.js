import { createSelector } from 'reselect';
import COLORS from 'pages/country/data/colors.json';

// get list data
const getFAO = state => state.fao || null;
const getRank = state => state.rank || null;
const getLocationNames = state => state.locationNames || null;

// get lists selected
export const getFAOForestData = createSelector(
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
        name: 'Naturally regenerated Forest',
        value: naturallyRegenerated,
        percentage: naturallyRegenerated / total * 100,
        color: '#959a00'
      },
      {
        name: 'Primary Forest',
        value: primaryForest,
        percentage: primaryForest / total * 100,
        color: '#2d8700'
      },
      {
        name: 'Planted Forest',
        value: plantedForest,
        percentage: plantedForest / total * 100,
        color: '#1e5a00'
      },
      {
        name: 'Non-Forest',
        value: nonForest,
        percentage: nonForest / total * 100,
        color: COLORS.nonForest
      }
    ];
  }
);
