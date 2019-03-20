import { createStructuredSelector } from 'reselect';

import {
  getActiveLayersWithWidgetSettings,
  getDrawing,
  getLabel,
  getBasemap
} from 'components/map/selectors';

export const selectGeostore = state => state.geostore && state.geostore.data;

export const getLayerManagerProps = createStructuredSelector({
  layers: getActiveLayersWithWidgetSettings,
  geostore: selectGeostore,
  labels: getLabel,
  basemap: getBasemap,
  drawing: getDrawing
});
