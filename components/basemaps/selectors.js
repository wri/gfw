import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { format, differenceInMonths } from 'date-fns';

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
  // const activeType = state?.map?.settings?.basemap?.color;
  // This can be either rgb<string> hex value <#xxx> or nir<string>
  // const imageType = activeType !== 'cir' ? 'visual' : 'analytic';
  const imageType = 'analytic';
  const planetBasemaps = state.planet?.data;
  // XXX: Filter planet basemaps based on active image type
  return planetBasemaps?.filter((bm) => bm.name.includes(imageType));
};

const getGroupedPlanetBasemaps = (state) => {
  const planetBasemaps = state.planet?.data;
  console.log('planetBasemaps', planetBasemaps);

  const visual = planetBasemaps
    ?.filter((bm) => bm.name.includes('visual'))
    .reverse();
  const cir = planetBasemaps
    ?.filter((bm) => bm.name.includes('analytic'))
    .reverse();
  return [visual, cir];
};

// ES6 provision, replace the hyphens with slashes forces UTC to be calculated from timestamp
// instead of local time
// interesting article: https://codeofmatt.com/javascript-date-parsing-changes-in-es6/
const cleanPlanetDate = (dateStr) =>
  new Date(dateStr.substring(0, 10).replace(/-/g, '/'));

export const getPlanetBasemaps = createSelector(
  [selectPlanetBasemaps],
  (planetBasemaps) => {
    if (isEmpty(planetBasemaps)) return null;
    return sortBy(
      planetBasemaps.map(({ name, first_acquired, last_acquired } = {}) => {
        const startDate = cleanPlanetDate(first_acquired);
        const endDate = cleanPlanetDate(last_acquired);
        const monthDiff = differenceInMonths(endDate, startDate);
        const period =
          monthDiff === 1
            ? `${format(startDate, 'MMM yyyy')}`
            : `${format(startDate, 'MMM yyyy')} - ${format(
                endDate,
                'MMM yyyy'
              )}`;

        return {
          name,
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

export const getDefaultPlanetBasemaps = createSelector(
  [getGroupedPlanetBasemaps],
  (grouped) => {
    const [visual, cir] = grouped;
    return {
      visual: visual?.[0]?.name,
      cir: cir?.[0]?.name,
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
