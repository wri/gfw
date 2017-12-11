import { createSelector } from 'reselect';

// get list data
const getTotalCover = state => state.totalArea || null;
const getTotalArea = state => state.cover || null;
const getPlantationsCover = state => state.plantations || null;

// get lists selected
export const getTreeCoverData = createSelector(
  [getTotalCover, getTotalArea, getPlantationsCover],
  (total, cover, plantations) => {
    if (!total || !cover) return null;
    return [
      {
        name: plantations ? 'Natural forest' : 'Tree cover',
        value: cover - plantations,
        color: '#2d8700',
        percentage: (cover - plantations) / total * 100
      },
      {
        name: 'Tree plantations',
        value: plantations,
        color: '#959a00',
        percentage: plantations / total * 100
      },
      {
        name: 'Non Forest',
        value: total - cover,
        color: '#d1d1d1',
        percentage: (total - cover) / total * 100
      }
    ];
  }
);
