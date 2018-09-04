import { createSelector, createStructuredSelector } from 'reselect';

import {
  getBasemap,
  getLabels,
  getActiveDatasetsState,
  getMapZoom,
  getActiveBoundaryDatasets,
  getBoundaryDatasets
} from 'components/map-v2/selectors';

import basemaps, { labels } from './basemaps-schema';

export const getAllBoundaries = createSelector(
  [getBoundaryDatasets],
  boundaries => [{ label: 'No boundaries', value: null }].concat(boundaries)
);

export const getBasemapsProps = createStructuredSelector({
  activeDatasets: getActiveDatasetsState,
  mapZoom: getMapZoom,
  activeLabels: getLabels,
  activeBasemap: getBasemap,
  boundaries: getAllBoundaries,
  activeBoundaries: getActiveBoundaryDatasets,
  basemaps: () => basemaps,
  labels: () => labels,
  landsatYears: () =>
    basemaps.landsat.availableYears.map(y => ({
      label: y,
      value: y
    }))
});
