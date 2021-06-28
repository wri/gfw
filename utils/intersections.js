import { LngLatBounds, LngLat } from 'mapbox-gl';

const TROPICS = [-180, -30, 180, 30];

function getBounds(bbox) {
  const southWest = new LngLat(bbox[0], bbox[1]);
  const northEast = new LngLat(bbox[2], bbox[3]);
  return new LngLatBounds(southWest, northEast);
}

function isIntersecting(source, target) {
  const sourceBounds = getBounds(source);
  const targetBounds = getBounds(target);
  const center = sourceBounds.getCenter();

  return targetBounds.contains([center.lng, center.lat]);
}

export const tropicsIntersection = (params, geostore) => {
  if (params.locationType === 'aoi' && params.pathname.includes('dashboards')) {
    let INTERSECTING_TROPICS;
    try {
      INTERSECTING_TROPICS = isIntersecting(geostore.bbox, TROPICS);
    } catch (_ignore) {
      INTERSECTING_TROPICS = false;
    }
    return {
      ...geostore,
      tropics: INTERSECTING_TROPICS,
    };
  }
  return geostore;
};
