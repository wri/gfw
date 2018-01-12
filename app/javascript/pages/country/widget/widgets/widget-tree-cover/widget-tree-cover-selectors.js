import { createSelector } from 'reselect';
import COLORS from 'pages/country/data/colors.json';
import isEmpty from 'lodash/isEmpty';

// get list data
const getData = state => state.data;
const getIndicator = state => state.indicator;
const getIndicatorWhitelist = state => state.whitelist;

// get lists selected
export const getTreeCoverData = createSelector(
  [getData, getIndicator, getIndicatorWhitelist],
  (data, indicator, whitelist) => {
    if (isEmpty(data) || isEmpty(whitelist)) return null;
    const { totalArea, cover, plantations } = data;
    const hasPlantations = Object.keys(whitelist).indexOf('plantations') > -1;
    const parsedData = [
      {
        name:
          hasPlantations && indicator === 'gadm28'
            ? 'Natural Forest'
            : 'Tree cover',
        value: cover - plantations,
        color: COLORS.darkGreen,
        percentage: (cover - plantations) / totalArea * 100
      },
      {
        name: 'Non-Forest',
        value: totalArea - cover,
        color: COLORS.nonForest,
        percentage: (totalArea - cover) / totalArea * 100
      }
    ];
    if (indicator === 'gadm28' && hasPlantations) {
      parsedData.splice(1, 0, {
        name: 'Tree plantations',
        value: plantations,
        color: COLORS.mediumGreen,
        percentage: plantations / totalArea * 100
      });
    }
    return parsedData;
  }
);
