import inside from 'turf-inside';
import point from 'turf-point';
import polygon from 'turf-polygon';

export const checkLocationInsideBbox = (latLng, bbox) => {
  const pt = point(latLng);
  const poly = polygon([bbox]);
  return inside(pt, poly);
};
