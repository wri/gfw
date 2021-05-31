import { createStructuredSelector, createSelector } from 'reselect';

import {
  getBasemaps,
  // getBasemap,
  // getMapLabels,
  // getMapZoom,
  // getMapRoads,
  // getActiveDatasetsFromState,
} from 'components/map/selectors';

export const getDynoBasemaps = createSelector(
  [getBasemaps],
  (basemaps) => {
    const out = [];
    Object.keys(basemaps).forEach(key => {
      if (!basemaps[key].static) {
        out.push(basemaps[key]);
      }
    });
    return out;
  }
);

export const getBasemapProps = createStructuredSelector({
  basemaps: getDynoBasemaps
});