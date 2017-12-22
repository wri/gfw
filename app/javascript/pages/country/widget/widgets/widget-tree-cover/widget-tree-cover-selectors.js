import { createSelector } from 'reselect';
import COLORS from 'pages/country/data/colors.json';

// get list data
const getTotalCover = state => state.totalArea;
const getTotalArea = state => state.cover;
const getPlantationsCover = state => state.plantations;
const getIndicator = state => state.indicator;

// get lists selected
export const getTreeCoverData = createSelector(
  [getTotalCover, getTotalArea, getPlantationsCover, getIndicator],
  (total, cover, plantations, indicator) => {
    if (!total) return null;
    const data = [
      {
        name: plantations ? 'Natural forest' : 'Tree cover',
        value: cover - plantations,
        color: COLORS.darkGreen,
        percentage: (cover - plantations) / total * 100
      },
      {
        name: 'Non-Forest',
        value: total - cover,
        color: COLORS.nonForest,
        percentage: (total - cover) / total * 100
      }
    ];
    if (indicator === 'gadm28') {
      data.splice(1, 0, {
        name: 'Tree plantations',
        value: plantations,
        color: COLORS.mediumGreen,
        percentage: plantations / total * 100
      });
    }
    return data;
  }
);
