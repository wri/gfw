import { createStructuredSelector } from 'reselect';

import {
  getBasemap,
  getLabels,
  getActiveDatasetsFromState,
  getMapZoom,
  getActiveBoundaryDatasets,
  getAllBoundaries
} from 'components/maps/map/selectors';

import basemaps, { labels } from './basemaps-schema';

export const getBasemapsProps = createStructuredSelector({
  activeDatasets: getActiveDatasetsFromState,
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
