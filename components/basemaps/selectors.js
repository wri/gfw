import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

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

const selectPlanetBasemaps = (state) => {
  const activeType = state?.map?.settings?.basemap?.color;
  // This can be either rgb<string> hex value <#xxx> or nir<string>
  const imageType = activeType !== 'cir' ? 'visual' : 'analytic';
  const { visual, analytical } = state.planet;
  return imageType === 'cir' ? analytical : visual;
};

const getPlanetBasemapOptions = (state) => {
  const {
    planet: { visual, analytical },
  } = state;
  return { visual, analytical };
};

export const getPlanetBasemaps = createSelector(
  [selectPlanetBasemaps],
  (planetBasemaps) => {
    if (isEmpty(planetBasemaps)) return null;
    return planetBasemaps;
  }
);

export const getDefaultPlanetBasemap = createSelector(
  [getPlanetBasemaps],
  (planetBasemaps) => planetBasemaps?.[0]?.name
);

export const getDefaultPlanetBasemaps = createSelector(
  [getPlanetBasemapOptions],
  (basemaps) => {
    return {
      visual: basemaps.visual?.[0]?.name,
      cir: basemaps.analytical?.[0]?.name,
    };
  }
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
  defaultPlanetBasemapsByCategory: getDefaultPlanetBasemaps,
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
