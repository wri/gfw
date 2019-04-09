import { createStructuredSelector, createSelector } from 'reselect';

export const selectMap = (state, { map }) => map;
export const selectLat = (state, { lat }) => lat;
export const selectLng = (state, { lng }) => lng;
export const selectZoom = (state, { zoom }) => zoom;
export const selectOptions = (state, { options }) => options;

export const getScales = createSelector(
  [selectMap, selectOptions, selectZoom, selectLng, selectLat],
  (map, options) => {
    if (map) {
      // A horizontal scale is imagined to be present at center of the map
      // container with maximum length (Default) as 100px.
      // Using spherical law of cosines approximation, the real distance is
      // found between the two coordinates.
      const maxWidth = (options && options.maxWidth) || 100;

      const y = map._container.clientHeight / 2;
      const maxMeters = getDistance(
        map.unproject([0, y]),
        map.unproject([maxWidth, y])
      );
      // The real distance corresponding to 100px scale length is rounded off to
      // near pretty number and the scale length for the same is found out.
      // Default unit of the scale is based on User's locale.
      const maxFeet = 3.2808 * maxMeters;
      let imperialScale = {};
      if (maxFeet > 5280) {
        const maxMiles = maxFeet / 5280;
        imperialScale = getScale(maxWidth, maxMiles, 'mi');
      } else {
        imperialScale = getScale(maxWidth, maxFeet, 'ft');
      }
      const metricScale = getScale(maxWidth, maxMeters, 'm');

      return {
        imperial: imperialScale,
        metric: metricScale
      };
    }
    return {};
  }
);

export const getMapScaleProps = createStructuredSelector({
  scales: getScales
});

export const getScale = (maxWidth, maxDistance, unit) => {
  const distance = getRoundNum(maxDistance);
  const ratio = distance / maxDistance;

  let newDistance = distance;
  let newUnit = unit;
  if (unit === 'm' && distance >= 1000) {
    newDistance = distance / 1000;
    newUnit = 'km';
  }

  return {
    width: maxWidth * ratio,
    scale: `${newDistance}${newUnit}`
  };
};

export const getDistance = (latlng1, latlng2) => {
  // Uses spherical law of cosines approximation.
  const R = 6371000;

  const rad = Math.PI / 180;
  const lat1 = latlng1.lat * rad;
  const lat2 = latlng2.lat * rad;
  const a =
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.cos((latlng2.lng - latlng1.lng) * rad);

  const maxMeters = R * Math.acos(Math.min(a, 1));
  return maxMeters;
};

export const getRoundNum = num => {
  const pow10 = Math.pow(10, `${Math.floor(num)}`.length - 1);
  let d = num / pow10;

  if (d >= 10) {
    d = 10;
  } else if (d >= 5) {
    d = 5;
  } else if (d >= 3) {
    d = 3;
  } else if (d >= 2) {
    d = 2;
  } else {
    d = 1;
  }

  return pow10 * d;
};
