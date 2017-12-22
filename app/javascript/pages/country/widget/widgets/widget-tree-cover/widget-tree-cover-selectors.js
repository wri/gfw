import { createSelector } from 'reselect';
import COLORS from 'pages/country/data/colors.json';

// get list data
const getTotalCover = state => state.totalArea || null;
const getTotalArea = state => state.cover || null;
const getPlantationsCover = state => state.plantations || null;
const getIndicator = state => state.indicator || null;

function getNameLabel(indicator, plantations) {
  if (indicator === 'plantations') {
    return 'Tree plantations';
  }
  return plantations ? 'Natural forest' : 'Tree cover';
}

// get lists selected
export const getTreeCoverData = createSelector(
  [getTotalCover, getTotalArea, getPlantationsCover, getIndicator],
  (total, cover, plantations, indicator) => {
    if (!total) return null;
    return [
      {
        name: getNameLabel(indicator, plantations),
        value: cover - plantations,
        color: COLORS.darkGreen,
        percentage: (cover - plantations) / total * 100
      },
      {
        name: 'Tree plantations',
        value: plantations,
        color: COLORS.mediumGreen,
        percentage: plantations / total * 100
      },
      {
        name: 'Non-Forest',
        value: total - cover,
        color: COLORS.nonForest,
        percentage: (total - cover) / total * 100
      }
    ];
  }
);
