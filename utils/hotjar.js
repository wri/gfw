export const TOGGLE_PLANET_BASEMAP = 'planet-toggle';

export const triggerEvent = (event) => {
  if (typeof hj === 'function') {
    hj('trigger', event);
  }
};
