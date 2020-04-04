import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';

export const selectLocation = (state) => state?.location?.payload;
export const selectAllLocation = (state) => state?.location;

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
  [getActiveArea, selectAllLocation],
  (area, location) => {
    const { payload } = location || {};
    const newLocation = {
      ...payload,
      routeType: location && location?.type,
      ...(payload &&
        payload.type === 'aoi' && {
          areaId: payload && payload.adm0,
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
