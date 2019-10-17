import { createSelector } from 'reselect';

import { getActiveArea } from 'providers/areas-provider/selectors';

export const selectLocation = state => state.location;
export const selectGeostore = state => state.geostore && state.geostore.data;
export const selectAdminData = state => state.geostore && state.geostore.data;

export const getDataLocation = createSelector(
  [getActiveArea, selectLocation, selectGeostore],
  (area, location, geostore) => {
    const { payload, type: routeType } = location;
    const newLocation = {
      ...payload,
      routeType,
      ...(payload.type === 'aoi' && {
        areaId: payload.adm0
      })
    };

    if (!area) return newLocation;

    const { admin, wdpaid, use } = area;
    if (!admin && !wdpaid && (!use || !use.id)) return newLocation;

    return {
      ...newLocation,
      type: 'geostore',
      adm0: geostore && geostore.id,
      ...(admin && {
        type: 'country',
        ...admin
      }),
      ...(wdpaid && {
        type: 'wdpa',
        adm0: wdpaid
      }),
      ...(use &&
        use.id && {
        type: 'use',
        use: use.id
      })
    };
  }
);
