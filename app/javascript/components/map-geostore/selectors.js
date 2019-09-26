import { createSelector, createStructuredSelector } from 'reselect';

import basemaps from 'components/map/basemaps';

export const getBasemaps = () => basemaps;

export const getBasemap = createSelector(
  [getBasemaps],
  allBasemaps => allBasemaps.planet
);

export const getRecentImageMapProps = createStructuredSelector({
  basemap: getBasemap
});
