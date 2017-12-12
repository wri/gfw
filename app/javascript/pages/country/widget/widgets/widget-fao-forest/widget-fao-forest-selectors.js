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
    if (!fao || !rank || !locationNames) return null;

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
    return {
      chartData: [
        {
          name: 'Naturally regenerated Forest',
          value: naturallyRegenerated,
          color: '#959a00',
          legendValue: format('.1f')(naturallyRegenerated / total * 100)
        },
        {
          name: 'Primary Forest',
          value: primaryForest,
          color: '#2d8700',
          legendValue: format('.1f')(primaryForest / total * 100)
        },
        {
          name: 'Planted Forest',
          value: plantedForest,
          color: '#1e5a00',
          legendValue: format('.1f')(plantedForest / total * 100)
        },
        {
          name: 'Non-Forest',
          value: nonForest,
          color: '#d1d1d1',
          legendValue: format('.1f')(nonForest / total * 100)
        }
      ],
      sentence: {
        __html: `FAO data from 2015 shows that ${locationNames.current &&
          locationNames.current.label} is ${
          nonForest / area_ha > 0.5 ? 'mostly non-forest.' : 'mostly forest.'
        }${
          primaryForest > 0
            ? ` Primary forest occupies <strong>${format('.1f')(
              primaryForest / area_ha * 100
            )}%</strong> of the country. This gives ${locationNames.current &&
                locationNames.current.label} a rank of <strong>${
              rank
            }th</strong> out of 110 countries in terms of its relative amount of primary forest.`
            : ''
        }`
      }
    };
  }
);
