import { createStructuredSelector, createSelector } from 'reselect';

import {
  getLayerGroups,
  getMapSettings,
  getActiveDatasetsFromState,
} from 'components/map/selectors';

const getLegendLayerGroups = createSelector([getLayerGroups], (groups) => {
  if (!groups) return null;
  return groups.filter((g) => !g.isBoundary && !g.isRecentImagery);
});

const getMapDatasets = createSelector([getMapSettings], (settings) => {
  return settings?.datasets;
});

export const getMiniLegendProps = createStructuredSelector({
  layers: getLegendLayerGroups,
  datasets: getMapDatasets,
  activeDatasets: getActiveDatasetsFromState,
});
