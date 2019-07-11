import { createStructuredSelector, createSelector } from 'reselect';

import {
  getActiveLayersWithDates,
  getDrawing,
  getBasemap,
  selectGeostore
} from 'components/map/selectors';

export const selectLocation = state => state.location && state.location.payload;

export const getIsAoI = createSelector(
  [selectLocation],
  location => location.type === 'aoi'
);

export const getLayerManagerProps = createStructuredSelector({
  layers: getActiveLayersWithDates,
  geostore: selectGeostore,
  basemap: getBasemap,
  drawing: getDrawing,
  isAoI: getIsAoI
});
