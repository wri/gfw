import { createStructuredSelector } from 'reselect';

import {
  getActiveLayersWithWidgetSettings,
  getDraw
} from 'components/map-v2/selectors';
import { getTileGeoJSON } from '../recent-imagery/recent-imagery-selectors';

export const selectGeostore = state => state.geostore.data;

export const getLayerManagerProps = createStructuredSelector({
  layers: getActiveLayersWithWidgetSettings,
  geostore: selectGeostore,
  tileGeoJSON: getTileGeoJSON,
  draw: getDraw
});
