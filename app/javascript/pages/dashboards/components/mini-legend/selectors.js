import { createStructuredSelector, createSelector } from 'reselect';

import {
  getLayerGroups,
  getActiveDatasetsFromState
} from 'components/map/selectors';

const getLegendLayerGroups = createSelector([getLayerGroups], groups => {
  if (!groups) return null;
  return groups.filter(g => !g.isBoundary && !g.isRecentImagery);
});

export const getMiniLegendProps = createStructuredSelector({
  layers: getLegendLayerGroups,
  activeDatasets: getActiveDatasetsFromState
});
