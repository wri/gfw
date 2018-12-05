import { createStructuredSelector } from 'reselect';

import {
  getActiveLayersWithWidgetSettings,
  getDraw
} from 'components/map-v2/selectors';

export const selectGeostore = state => state.geostore.data;

export const getLayerManagerProps = createStructuredSelector({
  layers: getActiveLayersWithWidgetSettings,
  geostore: selectGeostore,
  draw: getDraw
});
