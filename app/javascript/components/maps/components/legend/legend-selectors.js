import { createStructuredSelector, createSelector } from 'reselect';

import {
  getActiveDatasetsFromState,
  getLayerGroups
} from 'components/maps/map/selectors';

const getLoading = state =>
  state.datasets.loading || state.countryData.loading || state.latest.loading;

const getLegendLayerGroups = createSelector([getLayerGroups], groups => {
  if (!groups) return null;
  return groups.filter(g => !g.isBoundary && !g.isRecentImagery);
});

export const getLegendProps = createStructuredSelector({
  loading: getLoading,
  layerGroups: getLegendLayerGroups,
  activeDatasets: getActiveDatasetsFromState
});
