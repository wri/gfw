import { createSelector, createStructuredSelector } from 'reselect';

import basemaps from 'components/map/basemaps';

export const getBasemaps = () => basemaps;
export const getLatestPlanetBasemap = state =>
  state.planet && state.planet.data && state.planet.data[0];

export const getBasemap = createSelector(
  [getBasemaps, getLatestPlanetBasemap],
  (allBasemaps, latestPlanetBasemap) => {
    if (!latestPlanetBasemap) return null;

    const { planet } = allBasemaps;
    return {
      ...planet,
      url: planet.url.replace('{name}', latestPlanetBasemap.name)
    };
  }
);

export const getRecentImageMapProps = createStructuredSelector({
  basemap: getBasemap
});
