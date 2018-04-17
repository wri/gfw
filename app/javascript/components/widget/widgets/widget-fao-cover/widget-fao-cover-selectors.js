import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { format } from 'd3-format';
import { getColorPalette } from 'utils/data';

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
    const colorRange = getColorPalette(colors.ramp, 3);
    const naturallyRegenerated = extent / 100 * forest_regenerated;
    const primaryForest = forest_primary ? extent / 100 * forest_primary : 0;
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
        color: colorRange[0]
      },
      {
        label: 'Primary Forest',
        value: primaryForest,
        percentage: primaryForest / total * 100,
        color: colorRange[1]
      },
      {
        label: 'Planted Forest',
        value: plantedForest,
        percentage: plantedForest / total * 100,
        color: colorRange[2]
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
    const { area_ha, extent, forest_primary } = data;
    const primaryForest = extent / 100 * forest_primary;
    const sentence = `FAO data from 2015 shows that <strong>${locationNames.current &&
      locationNames.current.label}</strong> contains <strong>${format('.3s')(
      extent
    )}Ha</strong> of forest, ${
      primaryForest > 0
        ? ` with Primary forest occupying 
        <strong>${format('.1f')(
          primaryForest / area_ha * 100
        )}%</strong> of the country.`
        : ` which occupies 
        <strong>${format('.1f')(
          extent / area_ha * 100
        )}%</strong> of the country.`
    }`;
    return sentence;
  }
);
