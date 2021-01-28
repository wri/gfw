const isServer = typeof window !== 'undefined';
const isDebugMode = !isServer && process.env.NODE_ENV !== 'production';

// Hotjar events
export const TOGGLE_PLANET_BASEMAP = 'planet_toggle_on';

export const triggerEvent = (event) => {
  if (isDebugMode) {
    console.info(`hotjar trigger ${event}`); // eslint-disable-line
  }
  if (!isServer && typeof hj === 'function') {
    hj('trigger', event);
  }
};
