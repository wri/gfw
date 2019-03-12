import { createStructuredSelector } from 'reselect';

import {
  getActiveLayersWithWidgetSettings,
  getDraw,
  getLabel,
  getBasemap
} from 'components/maps/map/selectors';

export const selectGeostore = state => state.geostore && state.geostore.data;

export const getLayerManagerProps = createStructuredSelector({
  layers: getActiveLayersWithWidgetSettings,
  geostore: selectGeostore,
  labels: getLabel,
  basemap: getBasemap,
  draw: getDraw
});
