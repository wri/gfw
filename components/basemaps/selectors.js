import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format, isValid } from 'date-fns';

import {
  getBasemaps,
  getBasemap,
  getMapLabels,
  getMapZoom,
  getMapRoads,
  getActiveDatasetsFromState,
} from 'components/map/selectors';
import {
  getActiveBoundaryDatasets,
  getAllBoundaries,
} from 'components/analysis/selectors';

const selectPlanetBasemaps = (state) => state.planet?.data;

export const getPlanetBasemaps = createSelector(
  [selectPlanetBasemaps],
  (planetBasemaps) => {
    if (isEmpty(planetBasemaps)) return null;
    return sortBy(
      planetBasemaps.map(({ name } = {}) => {
        const splitName = name?.split('_');
        const startDate = new Date(`${splitName?.[4]}-01`);
        const endDate =
          splitName?.[5] === 'mosaic' ? null : new Date(`${splitName?.[5]}-01`);

        const range = isValid(endDate) ? '6 months' : '1 month';
        const period = isValid(endDate)
          ? `${format(startDate, 'MMM yyyy')} - ${format(endDate, 'MMM yyyy')}`
          : `${format(startDate, 'MMM yyyy')}`;

        return {
          name,
          range,
          period,
          sortOrder: Date(startDate),
        };
      }),
      'sortOrder'
    ).reverse();
  }
);

export const getDefaultPlanetBasemap = createSelector(
  [getPlanetBasemaps],
  (planetBasemaps) => planetBasemaps?.[0]?.name
);

export const getLandsatYears = createSelector([getBasemaps], (basemaps) =>
  basemaps.landsat.availableYears.map((y) => ({
    label: y,
    value: y,
  }))
);

export const getLabelsOptions = createSelector([], () => [
  {
    label: 'Show labels',
    value: 'showLabels',
  },
  {
    label: 'Hide labels',
    value: 'hideLabels',
  },
]);

export const getLabelSelected = createSelector(
  [getLabelsOptions, getMapLabels],
  (options, labelsActive) => (labelsActive ? options[0] : options[1])
);

export const getRoadsOptions = createSelector([], () => [
  {
    label: 'Hide Roads',
    value: false,
  },
  {
    label: 'Show Roads',
    value: true,
  },
]);

export const getRoadsSelected = createSelector(
  [getRoadsOptions, getMapRoads],
  (options, showRoads) => options.find((o) => showRoads === o.value)
);

export const getBasemapsProps = createStructuredSelector({
  activeDatasets: getActiveDatasetsFromState,
  mapZoom: getMapZoom,
  activeBasemap: getBasemap,
  boundaries: getAllBoundaries,
  activeBoundaries: getActiveBoundaryDatasets,
  basemaps: getBasemaps,
  defaultPlanetBasemap: getDefaultPlanetBasemap,
  labelSelected: getLabelSelected,
  labels: getLabelsOptions,
  landsatYears: getLandsatYears,
  roads: getRoadsOptions,
  roadsSelected: getRoadsSelected,
});
