import { createSelector } from 'reselect';
import { format } from 'd3-format';

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
        color: '#959a00',
        legendValue: format('.1f')(naturallyRegenerated / total * 100)
      },
      {
        name: 'Primary Forest',
        value: primaryForest,
        percentage: primaryForest / total * 100,
        color: '#2d8700',
        legendValue: format('.1f')(primaryForest / total * 100)
      },
      {
        name: 'Planted Forest',
        value: plantedForest,
        percentage: plantedForest / total * 100,
        color: '#1e5a00',
        legendValue: format('.1f')(plantedForest / total * 100)
      },
      {
        name: 'Non-Forest',
        value: nonForest,
        percentage: nonForest / total * 100,
        color: '#d1d1d1',
        legendValue: format('.1f')(nonForest / total * 100)
      }
    ];
  }
);
