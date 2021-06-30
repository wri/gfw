import { createStructuredSelector, createSelector } from 'reselect';

import find from 'lodash/find';

import { getBasemaps, getBasemap } from 'components/map/selectors';

import { getPeriodOptions } from './settings/planet-menu/selectors';

import { getSelectedYear } from './settings/landsat-menu/selectors';

const getLocation = (state) => state.location && state.location;
const isTropics = (state) => state?.geostore?.data?.tropics || false;
const getMapBasemapSettings = (state) => state?.map?.settings?.basemap;

export const getDynoBasemaps = createSelector(
  [getLocation, getBasemaps],
  (location, basemaps) => {
    const isDashboard = location.pathname.includes('/dashboards/');
    const out = [];
    Object.keys(basemaps).forEach((key) => {
      if (isDashboard && key !== 'planet') return;
      if (!basemaps[key].baseStyle) {
        out.push(basemaps[key]);
      }
    });
    return out;
  }
);

export const getActiveDynoBasemap = createSelector(
  [
    getLocation,
    getDynoBasemaps,
    getBasemap,
    isTropics,
    getPeriodOptions,
    getMapBasemapSettings,
    getBasemaps,
  ],
  (
    location,
    basemaps,
    activeBasemap,
    tropics,
    planetPeriods,
    mapBasemapSettings
  ) => {
    const isDashboard = location.pathname.includes('/dashboards/');
    if (!basemaps || !activeBasemap) {
      return null;
    }
    const defaultBasemap = find(basemaps, { value: 'planet' });
    const dynoBasemap = find(basemaps, { value: activeBasemap.value });

    if (dynoBasemap) {
      return {
        ...dynoBasemap,
        ...(isDashboard &&
          dynoBasemap.value !== 'planet' && {
            ...defaultBasemap,
          }),
        settings: mapBasemapSettings,
        ...(dynoBasemap &&
          dynoBasemap?.value === 'planet' && {
            planetPeriod: planetPeriods?.length
              ? planetPeriods.find((p) => p.value === mapBasemapSettings.name)
              : null,
          }),
        active: true,
      };
    }

    if (defaultBasemap) {
      return {
        ...defaultBasemap,
        settings: mapBasemapSettings,
        ...(defaultBasemap.value === 'planet' && {
          planetPeriod: planetPeriods?.length ? planetPeriods[0] : null,
        }),
        active: false,
      };
    }

    return null;
  }
);

export const getBasemapProps = createStructuredSelector({
  activeBasemap: getActiveDynoBasemap,
  planetPeriods: getPeriodOptions,
  landsatYear: getSelectedYear,
  basemaps: getDynoBasemaps,
  isTropics,
});
