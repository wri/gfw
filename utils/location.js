import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';

export const selectLocation = (state) => state.location;

export const getAllAreas = (state) =>
  state && state.areas && sortBy(state.areas.data, 'name');

export const getActiveArea = createSelector(
  [selectLocation, getAllAreas],
  (location, areas) => {
    if (isEmpty(areas)) return null;

    return areas.find(
      (a) =>
        a.id === location?.payload?.adm0 ||
        a.subscriptionId === location?.payload?.adm0
    );
  }
);

export const getDataLocation = createSelector(
  [getActiveArea, selectLocation],
  (area, location) => {
    const { payload, pathname } = location || {};
    const newLocation = {
      ...payload,
      pathname,
      ...(payload?.type === 'aoi' && {
        areaId: payload?.adm0,
      }),
      locationType: payload?.type
    };
    if (!area) return newLocation;
    const { location: areaLocation } = area;
    return {
      ...newLocation,
      ...areaLocation,
    };
  }
);

export const buildFullLocationName = (
  { adm0, adm1, adm2 },
  { adm0s, adm1s, adm2s }
) => {
  let location = '';
  if (
    (adm0 && isEmpty(adm0s)) ||
    (adm1 && isEmpty(adm1s)) ||
    (adm2 && isEmpty(adm2s))
  ) {
    return '';
  }
  if (adm0) {
    const adm0Obj = adm0s && adm0s.find((a) => a.value === adm0);
    location = adm0Obj ? adm0Obj.label : '';
  }
  if (adm1) {
    const adm1Obj = adm1s && adm1s.find((a) => a.value === parseInt(adm1, 10));
    location = adm1Obj
      ? `${adm1Obj.label || 'unnamed region'}, ${location}`
      : location;
  }
  if (adm2) {
    const adm2Obj = adm2s && adm2s.find((a) => a.value === parseInt(adm2, 10));
    location = adm2Obj
      ? `${adm2Obj.label || 'unnamed region'}, ${location}`
      : location;
  }
  return location;
};

export const locationLevelToStr = (location) => {
  const { type, adm0, adm1, adm2 } = location;
  if (adm2) return 'adm2';
  if (adm1) return 'adm1';
  if (adm0) return 'adm0';
  return type || 'global';
};
