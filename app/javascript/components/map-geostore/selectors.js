import { createSelector, createStructuredSelector } from 'reselect';

import basemaps from 'components/map/basemaps';

export const getBasemaps = () => basemaps;
export const getPlanetBasemaps = state =>
  state.planet && state.planet.data && state.planet.data;

export const getLatestPlanetBasemap = createSelector(
  [getPlanetBasemaps],
  planetBasemaps => {
    if (!planetBasemaps || !planetBasemaps.length) return null;
    const quarterlyBasemaps = planetBasemaps.filter(
      b => b.interval === '3 mons'
    );
    return quarterlyBasemaps[quarterlyBasemaps.length - 1];
  }
);

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
