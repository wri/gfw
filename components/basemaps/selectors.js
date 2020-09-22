import { createStructuredSelector, createSelector } from 'reselect';
import moment from 'moment';

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

export const getPlanetYears = createSelector([getBasemaps], basemaps =>
  basemaps.planet.availableYears.map(y => ({
    label: y,
    value: y
  }))
);

export const getPlanetMonths = createSelector([getBasemaps], basemaps =>
  Object.assign(...Object.keys(basemaps.planet.availableMonths).map(y => ({
    [y]: basemaps.planet.availableMonths[y].map(m => ({
      label: moment().month(parseInt(m, 10) - 1).format("MMM"),
      value: m
    }))
  })))
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
  planetYears: getPlanetYears,
  planetMonths: getPlanetMonths,
  roads: getRoadsOptions,
  roadsSelected: getRoadsSelected
});
