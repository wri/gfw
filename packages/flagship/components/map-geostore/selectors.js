import { createSelector, createStructuredSelector } from 'reselect';
import max from 'lodash/max';

import basemaps from 'components/map/basemaps';

export const getBasemaps = () => basemaps;

export const getBasemap = createSelector([getBasemaps], allBasemaps => {
  const { landsat } = allBasemaps;
  return {
    ...landsat,
    url: landsat.url.replace('{year}', max(landsat.availableYears))
  };
});

export const getRecentImageMapProps = createStructuredSelector({
  basemap: getBasemap
});
