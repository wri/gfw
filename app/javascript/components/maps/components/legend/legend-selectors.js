import { createStructuredSelector } from 'reselect';

import {
  getActiveDatasetsFromState,
  getLegendLayerGroups
} from 'components/maps/map/selectors';

const getLoading = state =>
  state.datasets.loading || state.countryData.loading || state.latest.loading;

export const getLegendProps = createStructuredSelector({
  loading: getLoading,
  layerGroups: getLegendLayerGroups,
  activeDatasets: getActiveDatasetsFromState
});
