import inside from 'turf-inside';
import point from 'turf-point';
import polygon from 'turf-polygon';
import min from 'lodash/min';
import max from 'lodash/max';

import BOUNDS from 'data/bounds.json';

export const checkLocationInsideBbox = (latLng, bbox) => {
  const pt = point(latLng);
  const poly = polygon([bbox]);
  return inside(pt, poly);
};

export const getBoxBounds = (cornerBounds, country, region) => {
  if (!region && Object.keys(BOUNDS).includes(country)) {
    return BOUNDS[country];
  }
  return [
    [cornerBounds[0], cornerBounds[1]],
    [cornerBounds[0], cornerBounds[3]],
    [cornerBounds[2], cornerBounds[3]],
    [cornerBounds[2], cornerBounds[1]],
    [cornerBounds[0], cornerBounds[1]]
  ];
};

export const getCornersFromBounds = bounds => {
  const xCoords = bounds.map(b => b[0]);
  const yCoords = bounds.map(b => b[1]);
  return [min(xCoords), max(xCoords), min(yCoords), max(yCoords)];
};

export const reverseLatLng = bounds => bounds.map(b => [b[1], b[0]]);

export const validateLatLng = (lat, lng) =>
  lat <= 90 && lat >= -90 && lng <= 180 && lng >= -180;

export const validateLat = lat => lat <= 90 && lat >= -90;

export const validateLng = lng => lng <= 180 && lng >= -180;
