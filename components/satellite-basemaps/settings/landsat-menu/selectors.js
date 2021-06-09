import { createStructuredSelector, createSelector } from 'reselect';

import {
  getBasemaps,
  getMapSettings
} from 'components/map/selectors';

export const getLandsatYears = createSelector([getBasemaps], (basemaps) =>
  basemaps.landsat.availableYears.map((y) => ({
    label: y,
    value: y,
  }))
);

export const getSelectedYear = createSelector([getBasemaps, getMapSettings], (basemaps, mapSettings) =>
mapSettings?.basemap?.year || basemaps.landsat.defaultYear)

export default createStructuredSelector({
  availableYears: getLandsatYears,
  year: getSelectedYear
});
