import { createStructuredSelector, createSelector } from 'reselect';

import {
  getBasemaps,
  getBasemap,
  getMapLabels,
  getMapZoom,
  getMapRoads,
  getActiveDatasetsFromState
} from 'components/map/selectors';
import {
  getActiveBoundaryDatasets,
  getAllBoundaries
} from 'components/analysis/selectors';

export const getLandsatYears = createSelector([getBasemaps], basemaps =>
  basemaps.landsat.availableYears.map(y => ({
    label: y,
    value: y
  }))
);

export const getLabelsOptions = createSelector([], () => [
  {
    label: 'Show labels',
    value: 'showLabels'
  },
  {
    label: 'Hide labels',
    value: 'hideLabels'
  }
]);

export const getLabelSelected = createSelector(
  [getLabelsOptions, getMapLabels],
  (options, labelsActive) => (labelsActive ? options[0] : options[1])
);

export const getRoadsOptions = createSelector([], () => [
  {
    label: 'Hide Roads',
    value: false
  },
  {
    label: 'Show Roads',
    value: true
  }
]);

export const getRoadsSelected = createSelector(
  [getRoadsOptions, getMapRoads],
  (options, showRoads) => options.find(o => showRoads === o.value)
);

export const getBasemapsProps = createStructuredSelector({
  activeDatasets: getActiveDatasetsFromState,
  mapZoom: getMapZoom,
  activeBasemap: getBasemap,
  boundaries: getAllBoundaries,
  activeBoundaries: getActiveBoundaryDatasets,
  basemaps: getBasemaps,
  labelSelected: getLabelSelected,
  labels: getLabelsOptions,
  landsatYears: getLandsatYears,
  roads: getRoadsOptions,
  roadsSelected: getRoadsSelected
});
