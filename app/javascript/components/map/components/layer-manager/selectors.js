import { createStructuredSelector } from 'reselect';

import {
  getActiveLayersWithDates,
  getActiveLayersForCompare,
  getActiveLayersForLeftCompare,
  getDrawing,
  getBasemap,
  selectGeostore
} from 'components/map/selectors';

export const getLayerManagerProps = createStructuredSelector({
  layers: getActiveLayersWithDates,
  compareLayers: getActiveLayersForCompare,
  leftCompareLayers: getActiveLayersForLeftCompare,
  geostore: selectGeostore,
  basemap: getBasemap,
  drawing: getDrawing
});
