import { createSelector } from 'reselect';

import { getActiveArea } from 'providers/areas-provider/selectors';

export const selectLocation = state => state.location;
export const selectAdminData = state => state.geostore && state.geostore.data;

export const getDataLocation = createSelector(
  [getActiveArea, selectLocation],
  (area, location) => {
    const { payload, type: routeType } = location;
    const newLocation = {
      ...payload,
      routeType,
      ...(payload.type === 'aoi' && {
        areaId: payload.adm0
      })
    };

    if (!area) return newLocation;
    const { location: areaLocation } = area;

    return {
      ...newLocation,
      ...areaLocation
    };
  }
);
