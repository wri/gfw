import { createStructuredSelector, createSelector } from 'reselect';

import find from 'lodash/find';

import { getBasemaps, getBasemap } from 'components/map/selectors';

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
    getMapBasemapSettings,
    getBasemaps,
  ],
  (location, basemaps, activeBasemap, tropics, mapBasemapSettings) => {
    const isDashboard = location.pathname.includes('/dashboards/');
    if (!basemaps || !activeBasemap) {
      return null;
    }
    const defaultBasemap = find(basemaps, { value: 'satellite' });
    const dynoBasemap = find(basemaps, { value: activeBasemap.value });

    if (dynoBasemap) {
      return {
        ...dynoBasemap,
        ...(isDashboard && {
          ...defaultBasemap,
        }),
        settings: mapBasemapSettings,
        active: true,
      };
    }

    if (defaultBasemap) {
      return {
        ...defaultBasemap,
        settings: mapBasemapSettings,
        active: false,
      };
    }

    return null;
  }
);

export const getBasemapProps = createStructuredSelector({
  activeBasemap: getActiveDynoBasemap,
  landsatYear: getSelectedYear,
  basemaps: getDynoBasemaps,
  isTropics,
});
