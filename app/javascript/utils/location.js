import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';

export const selectLocation = (state) => state?.location;

export const getAllAreas = (state) =>
  state && state.areas && sortBy(state.areas.data, 'name');

export const getActiveArea = createSelector(
  [selectLocation, getAllAreas],
  (location, areas) => {
    if (isEmpty(areas)) return null;

    return areas.find(
      (a) => a.id === location.adm0 || a.subscriptionId === location.adm0
    );
  }
);

export const getDataLocation = createSelector(
  [getActiveArea, selectLocation],
  (area, location) => {
    const newLocation = {
      ...location,
      ...(location?.type === 'aoi' && {
          areaId: location?.adm0,
        }),
    };

    if (!area) return newLocation;
    const { location: areaLocation } = area;

    return {
      ...newLocation,
      ...areaLocation,
    };
  }
);
