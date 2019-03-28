import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

import {
  getBasemaps,
  getLabels,
  getBasemap,
  getLabel,
  getActiveDatasetsFromState,
  getMapZoom,
  getActiveBoundaryDatasets,
  getAllBoundaries
} from 'components/maps/map/selectors';

const frequencyOptions = [
  {
    label: 'Monthly',
    value: '1 mon'
  },
  {
    label: 'Quarterly',
    value: '3 mons'
  }
];

const selectPlanetBasemaps = state =>
  state.basemaps && state.basemaps.data && state.basemaps.data.planet;

export const getPlanetBasemaps = createSelector(
  [selectPlanetBasemaps],
  planetBasemaps => {
    if (isEmpty(planetBasemaps)) return null;
    return planetBasemaps.map(p => {
      const splitName = p.name.split('_');
      let label = '';
      if (p.interval === '1 mon') {
        label = `${splitName[3]}/${splitName[2]}`;
      } else if (p.interval === '3 mons') {
        label = splitName[2];
      }

      return {
        label,
        frequency: p.interval,
        value: p._links.tiles
      };
    });
  }
);

export const getPlanetBasemapsByFrequency = createSelector(
  [getPlanetBasemaps],
  planetBasemaps => {
    if (isEmpty(planetBasemaps)) return null;
    const monthly = planetBasemaps.filter(m => m.frequency === '1 mon');
    const quarterly = planetBasemaps.filter(m => m.frequency === '3 mons');

    return {
      '1 mon': monthly,
      '3 mons': quarterly
    };
  }
);

export const selectPlanetBasemapsFreqOptions = createSelector(
  [getPlanetBasemapsByFrequency],
  planetBasemaps => {
    if (isEmpty(planetBasemaps)) return frequencyOptions;
    return frequencyOptions.map(f => ({
      ...f,
      url: planetBasemaps[f.value][0].value
    }));
  }
);

export const getPlanetBasemapsFrequencySelected = createSelector(
  [selectPlanetBasemapsFreqOptions, getBasemap],
  (options, basemap) =>
    (basemap.frequency
      ? options.find(o => o.value === basemap.frequency)
      : options[0])
);

export const getPlanetBasemapsOptions = createSelector(
  [getPlanetBasemapsByFrequency, getBasemap],
  (planetBasemaps, basemap) => {
    if (isEmpty(planetBasemaps)) return null;
    return planetBasemaps[basemap.frequency || '1 mon'];
  }
);

export const getPlanetBasemapSelected = createSelector(
  [getPlanetBasemapsOptions, getBasemap],
  (planetBasemaps, basemap) => {
    if (isEmpty(planetBasemaps)) return null;
    if (basemap.value !== 'planet') return planetBasemaps[0];
    return planetBasemaps.find(p => p.value === basemap.url);
  }
);

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
  landsatYears: getLandsatYears,
  planetFreqOptions: selectPlanetBasemapsFreqOptions,
  planetFreqSelected: getPlanetBasemapsFrequencySelected,
  planetBasemapOptions: getPlanetBasemapsOptions,
  planetBasemapSelected: getPlanetBasemapSelected
});
