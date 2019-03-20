import { createStructuredSelector, createSelector } from 'reselect';

import {
  getBasemaps,
  getLabels,
  getBasemap,
  getLabel,
  getActiveDatasetsFromState,
  getMapZoom,
  getActiveBoundaryDatasets,
  getAllBoundaries
} from 'components/map/selectors';

export const getLandsatYears = createSelector([getBasemaps], basemaps =>
  basemaps.landsat.availableYears.map(y => ({
    label: y,
    value: y
  }))
);

export const getBasemapsProps = createStructuredSelector({
  activeDatasets: getActiveDatasetsFromState,
  mapZoom: getMapZoom,
  activeLabels: getLabel,
  activeBasemap: getBasemap,
  boundaries: getAllBoundaries,
  activeBoundaries: getActiveBoundaryDatasets,
  basemaps: getBasemaps,
  labels: getLabels,
  landsatYears: getLandsatYears
});
