import { createStructuredSelector, createSelector } from 'reselect';

import {
  getActiveLayersWithDates,
  getDrawing,
  getBasemap,
  selectGeostore
} from 'components/map/selectors';

export const selectLocation = state => state.location && state.location.payload;

export const getAoIId = createSelector(
  [selectLocation],
  location => location.type && location.adm0
);

export const getLayerManagerProps = createStructuredSelector({
  layers: getActiveLayersWithDates,
  geostore: selectGeostore,
  basemap: getBasemap,
  drawing: getDrawing,
  aoiId: getAoIId
});
