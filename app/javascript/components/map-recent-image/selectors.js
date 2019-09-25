import { createSelector, createStructuredSelector } from 'reselect';

import basemaps from 'components/map/basemaps';

// CONSTS
export const getBasemaps = () => basemaps;

const selectGeostore = state => state.geostore && state.geostore.data;

export const getBasemap = createSelector(
  [getBasemaps],
  allBasemaps => allBasemaps.planet
);

export const getRecentImageMapProps = createStructuredSelector({
  basemap: getBasemap,
  geostore: selectGeostore
});
