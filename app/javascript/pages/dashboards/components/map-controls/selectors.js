import { createStructuredSelector } from 'reselect';

import {
  getMapViewport,
  getActiveDatasetsFromState,
  getMapMinZoom,
  getMapMaxZoom
} from 'components/map/selectors';

export const getMapControlsProps = createStructuredSelector({
  viewport: getMapViewport,
  datasets: getActiveDatasetsFromState,
  minZoom: getMapMinZoom,
  maxZoom: getMapMaxZoom
});
