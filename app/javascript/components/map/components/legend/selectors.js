import { createStructuredSelector, createSelector } from 'reselect';

import {
  getActiveDatasetsFromState,
  getLayerGroups
} from 'components/maps/map/selectors';

const selectLatestLoading = state => state.latest && state.latest.loading;
const selectDatasetsLoading = state => state.datasets && state.datasets.loading;
const selectCountryDataLoading = state =>
  state.countryData && state.countryData.loading;

export const getLoading = createSelector(
  [selectLatestLoading, selectDatasetsLoading, selectCountryDataLoading],
  (latestLoading, datasetsLoading, countryDataLoading) =>
    latestLoading || datasetsLoading || countryDataLoading
);

const getLegendLayerGroups = createSelector([getLayerGroups], groups => {
  if (!groups) return null;
  return groups.filter(g => !g.isBoundary && !g.isRecentImagery);
});

export const getLegendProps = createStructuredSelector({
  loading: getLoading,
  layerGroups: getLegendLayerGroups,
  activeDatasets: getActiveDatasetsFromState
});
